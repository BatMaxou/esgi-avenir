import { User } from '../../../domain/entities/User';
import { SseServerClientInterface } from '../../../application/services/sse/SseServerClientInterface';
import { SseRessourceEnum } from '../../services/sse/SseRessourceEnum';

export class SubscribeNotificationUsecase<SseRequest, SseResponse> {
  public constructor(
    private readonly sseServerClient: SseServerClientInterface<SseRequest, SseResponse>,
  ) {}

  public async execute(
    request: SseRequest,
    response: SseResponse,
    user: User,
  ): Promise<void> {
    if (!user.id) {
      return;
    }

    this.sseServerClient.initSseConnection(response);
    this.sseServerClient.registerClient(user.id, SseRessourceEnum.NOTIFICATIONS, response);
    this.sseServerClient.registerClient(user.id, SseRessourceEnum.PRIVATE_NOTIFICATIONS, response);
    this.sseServerClient.initSseCloseConnection(user.id, SseRessourceEnum.NOTIFICATIONS, request);
    this.sseServerClient.initSseCloseConnection(user.id, SseRessourceEnum.PRIVATE_NOTIFICATIONS, request);
  }
}

