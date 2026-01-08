import { ApiClientError } from '../ApiClientError';
import { Notification } from '../../../../domain/entities/Notification';

export interface GetNotificationResponseInterface extends Notification {}
export interface GetNotificationListResponseInterface extends Array<GetNotificationResponseInterface> {}

export interface CreateNotificationPayloadInterface {
  content: string;
  userId?: number;
}

export interface NotificationResourceInterface {
  getAll(): Promise<GetNotificationListResponseInterface | ApiClientError>;
  create(data: CreateNotificationPayloadInterface): Promise<GetNotificationResponseInterface | ApiClientError>;
}

