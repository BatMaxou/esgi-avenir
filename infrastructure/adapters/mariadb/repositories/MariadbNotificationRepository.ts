import { Op } from "sequelize";
import { NotificationRepositoryInterface } from "../../../../application/repositories/NotificationRepositoryInterface";
import { Notification } from "../../../../domain/entities/Notification";
import { databaseDsn } from "../../../express/utils/tools";
import { MariadbConnection } from "../config/MariadbConnection";
import { NotificationModel } from "../models/NotificationModel";
import { UserModel } from "../models/UserModel";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";

export class MariadbNotificationRepository implements NotificationRepositoryInterface {
  private notificationModel: NotificationModel;
  private userModel: UserModel;

  public constructor() {
    const connection = new MariadbConnection(databaseDsn).getConnection();
    this.userModel = new UserModel(connection);
    this.notificationModel = new NotificationModel(connection, this.userModel);
  }

  public async create(notification: Notification): Promise<Notification | UserNotFoundError> {
    try {
      const createdNotification = await this.notificationModel.model.create({
        content: notification.content,
        advisorId: notification.advisorId,
        userId: notification.userId,
      });

      const maybeNotification = Notification.from(createdNotification);
      if (maybeNotification instanceof Error) {
        throw maybeNotification;
      }

      return maybeNotification;
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
        if (error.message.includes('userId')) {
          return new UserNotFoundError('User not found.');
        } else if (error.message.includes('advisorId')) {
          return new UserNotFoundError('Advisor not found.');
        }
      }

      throw error;
    }
  }

  public async findAllByUser(userId: number): Promise<Notification[]> {
    const foundNotifications = await this.notificationModel.model.findAll({
      where: {
        [Op.or]: [
          { userId: userId },
          { userId: null },
          { advisorId: userId },
        ],
      },
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
  }
}

