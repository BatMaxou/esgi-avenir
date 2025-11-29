import { NotificationRepositoryInterface } from '../repositories/NotificationRepositoryInterface';
import { Notification } from '../../domain/entities/Notification';

type MockNotification = {
  content: string,
  advisorId: number,
  userId?: number,
}

export class NotificationFixtures {
  public constructor(
    private readonly repository: NotificationRepositoryInterface,
  ) {}

  public async load(): Promise<boolean | Error> {
    const notifications: MockNotification[] = [
      {
        content: 'Le site sera en maintenance entre 2h et 4h du matin.',
        advisorId: 5,
      },
      {
        content: 'Votre rendez-vous a été confirmé pour le 15 juin à 10h.',
        advisorId: 5,
        userId: 2,
      },
    ];

    for (const notification of notifications) {
      await this.createNotification(notification);
    }

    return true;
  }

  private async createNotification(mockNotification: MockNotification): Promise<boolean | Error> {
    const maybeNotification = Notification.from(mockNotification);
    if (maybeNotification instanceof Error) {
      return maybeNotification;
    }

    const maybeError = await this.repository.create(maybeNotification);
    if (maybeError instanceof Error) {
      return maybeError;
    }

    return true;
  }
}
