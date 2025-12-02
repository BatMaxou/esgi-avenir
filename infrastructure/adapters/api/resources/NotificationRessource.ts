import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { ApiClientInterface } from "../../../../application/services/api/ApiClientInterface";
import { paths } from "../../../../application/services/api/paths";
import { CreateNotificationPayloadInterface, GetNotificationListResponseInterface, GetNotificationResponseInterface, NotificationResourceInterface } from "../../../../application/services/api/resources/NotificationResourceInterface";

export class NotificationResource implements NotificationResourceInterface {
  constructor(private apiClient: ApiClientInterface) {}

  public async getAll(): Promise<GetNotificationListResponseInterface | ApiClientError> {
    return this.apiClient.get<GetNotificationListResponseInterface>(paths.notification.list);
  }

  public async create(data: CreateNotificationPayloadInterface): Promise<GetNotificationResponseInterface | ApiClientError> {
    return this.apiClient.post<GetNotificationResponseInterface>(paths.notification.create, data);
  }
}
