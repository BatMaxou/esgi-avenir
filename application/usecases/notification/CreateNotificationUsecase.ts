import { Notification } from '../../../domain/entities/Notification';
import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { NotificationRepositoryInterface } from '../../repositories/NotificationRepositoryInterface';

export class CreateNotificationUsecase {
  public constructor(
    private readonly notificationRepository: NotificationRepositoryInterface,
  ) {}

  public async execute(
    content: string,
    advisor: User,
    userId?: number,
  ): Promise<Notification | UserNotFoundError> {
    const maybeNewNotification = Notification.from({
      content,
      advisor,
      userId,
    });
    if (maybeNewNotification instanceof UserNotFoundError) {
      return maybeNewNotification;
    }

    return await this.notificationRepository.create(maybeNewNotification);
  }
}

