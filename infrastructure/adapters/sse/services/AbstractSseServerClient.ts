import { SseRessourceEnum } from "../../../../application/services/sse/SseRessourceEnum";
import { SseReponsesDataInterface, SseServerClientInterface } from "../../../../application/services/sse/SseServerClientInterface";
import { SseResponseAssistantInterface } from "../../../../application/services/sse/SseResponseAssistantInterface";

export abstract class AbstractSseServerClient<SseRequest, SseResponse> implements SseServerClientInterface<SseRequest, SseResponse> {
  private clients: Record<string, any> = {};

  public constructor(
    private readonly responseWriter: SseResponseAssistantInterface<SseRequest, SseResponse>,
  ) {}

  public initSseConnection(response: SseResponse): void {
    this.responseWriter.prepare(response);
  }

  public registerClient(userId: number, ressource: SseRessourceEnum, response: SseResponse): void {
    const key = `${ressource}-${userId}`;

    this.clients[key] = response;
  }

  public broadcast(ressource: SseRessourceEnum, data: SseReponsesDataInterface): void {
    Object.keys(this.clients).forEach((key) => {
      if (key.startsWith(`${ressource}-`)) {
        const response = this.clients[key];
        this.responseWriter.write(response, [
          `event: ${ressource}\n`,
          `data: ${JSON.stringify([data])}\n\n`,
        ]);
      }
    });
  }

  public sendTo(userId: number, ressource: SseRessourceEnum, data: SseReponsesDataInterface): void {
    Object.keys(this.clients).forEach((key) => {
      if (key === `${ressource}-${userId}`) {
        const response = this.clients[key];
        this.responseWriter.write(response, [
          `event: ${ressource}\n`,
          `data: ${JSON.stringify([data])}\n\n`,
        ]);
      }
    });
  }

  public initSseCloseConnection(userId: number, ressource: SseRessourceEnum, request: SseRequest): void {
    const key = `${ressource}-${userId}`;

    this.responseWriter.remove(request, () => delete this.clients[key]);
  }
}
