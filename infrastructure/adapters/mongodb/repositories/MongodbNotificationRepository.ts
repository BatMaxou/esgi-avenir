import { NotificationRepositoryInterface } from "../../../../application/repositories/NotificationRepositoryInterface";
import { Notification } from "../../../../domain/entities/Notification";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { openConnection } from "../config/MongodbConnection";
import { NotificationModel } from "../models/NotificationModel";
import { UserModel } from "../models/UserModel";
import { getNextSequence } from "../models/CounterModel";

export class MongodbNotificationRepository
  implements NotificationRepositoryInterface
{
  private async ensureConnection(): Promise<void> {
    await openConnection();
  }

  public async create(
    notification: Notification
  ): Promise<Notification | UserNotFoundError> {
    try {
      await this.ensureConnection();

      // Validate advisor
      if (notification.advisorId) {
        const advisor = await UserModel.findOne({ id: notification.advisorId });
        if (!advisor) {
          return new UserNotFoundError("Advisor not found.");
        }
      }

      // Validate user if provided
      if (notification.userId) {
        const user = await UserModel.findOne({ id: notification.userId });
        if (!user) {
          return new UserNotFoundError("User not found.");
        }
      }

      const notificationId = await getNextSequence("notification_id");

      const createdNotification = await NotificationModel.create({
        id: notificationId,
        content: notification.content,
        advisorId: notification.advisorId,
        userId: notification.userId,
        createdAt: new Date(),
      });

      const maybeNotification = Notification.from(createdNotification);
      if (maybeNotification instanceof Error) {
        throw maybeNotification;
      }

      return maybeNotification;
    } catch (error) {
      return new UserNotFoundError("User not found.");
    }
  }

  public async findAllByUser(userId: number): Promise<Notification[]> {
    try {
      await this.ensureConnection();

      const foundNotifications = await NotificationModel.find({
        $or: [{ userId: userId }, { userId: null }, { advisorId: userId }],
      });

      const notifications: Notification[] = [];

      foundNotifications.forEach((foundNotification) => {
        const maybeNotification = Notification.from(foundNotification);
        if (maybeNotification instanceof Error) {
          throw maybeNotification;
        }

        notifications.push(maybeNotification);
      });

      return notifications;
    } catch (error) {
      return [];
    }
  }
}
