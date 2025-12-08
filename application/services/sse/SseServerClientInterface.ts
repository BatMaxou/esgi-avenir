import { SseRessourceEnum } from "./SseRessourceEnum";

export interface SseReponsesDataInterface extends Object {}

export interface SseServerClientInterface<SseRequest, SseResponse> {
  initSseConnection(response: SseResponse): void;
  registerClient(userId: number, ressource: SseRessourceEnum, response: SseResponse): void;
  broadcast(ressource: SseRessourceEnum, data: SseReponsesDataInterface): void;
  sendTo(userId: number, ressource: SseRessourceEnum, data: SseReponsesDataInterface): void;
  initSseCloseConnection(userId: number, ressource: SseRessourceEnum, request: SseRequest): void;
}

