import { Notification } from '../../../domain/entities/Notification';
import { User } from '../../../domain/entities/User';
import { NotificationRepositoryInterface } from '../../repositories/NotificationRepositoryInterface';

export class GetNotificationListUsecase {
  public constructor(
    private readonly notificationRepository: NotificationRepositoryInterface,
  ) {}

  public async execute(
    user: User,
  ): Promise<Notification[]> {
    if (!user.id) {
      return [];
    }

    const notifications = await this.notificationRepository.findAllByUser(user.id);

    return notifications.sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }
}

