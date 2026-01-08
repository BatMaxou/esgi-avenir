import { Notification } from '../../../domain/entities/Notification';
import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { NotificationRepositoryInterface } from '../../repositories/NotificationRepositoryInterface';
import { SseRessourceEnum } from '../../services/sse/SseRessourceEnum';
import { SseServerClientInterface } from '../../services/sse/SseServerClientInterface';

export class CreateNotificationUsecase<SseRequest, SseResponse> {
  public constructor(
    private readonly notificationRepository: NotificationRepositoryInterface,
    private readonly sseServerClient: SseServerClientInterface<SseRequest, SseResponse>,
  ) {}

  public async execute(
    content: string,
    advisor: User,
    userId?: number,
  ): Promise<Notification | UserNotFoundError> {
    const maybeNotification = Notification.from({
      content,
      advisor,
      userId,
    });
    if (maybeNotification instanceof UserNotFoundError) {
      return maybeNotification;
    }

    const maybeNewNotification = await this.notificationRepository.create(maybeNotification);
    if (maybeNewNotification instanceof UserNotFoundError) {
      return maybeNewNotification;
    }

    if (maybeNewNotification.userId) {
      this.sseServerClient.sendTo(
        maybeNewNotification.userId,
        SseRessourceEnum.PRIVATE_NOTIFICATIONS,
        maybeNewNotification,
      );

      return maybeNewNotification;
    }


    this.sseServerClient.broadcast(
      SseRessourceEnum.NOTIFICATIONS,
      maybeNewNotification,
    );

    return maybeNewNotification;
  }
}

