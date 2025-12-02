import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { ApiClientInterface } from "../../../../application/services/api/ApiClientInterface";
import { paths } from "../../../../application/services/api/paths";
import { GetMessageResponseInterface } from "../../../../application/services/api/resources/MessageResourceInterface";
import { CreatePrivateMessagePayloadInterface, PrivateMessageResourceInterface } from "../../../../application/services/api/resources/PrivateMessageResourceInterface";

export class PrivateMessageResource implements PrivateMessageResourceInterface {
  constructor(private apiClient: ApiClientInterface) {}

  public async create(data: CreatePrivateMessagePayloadInterface): Promise<GetMessageResponseInterface | ApiClientError> {
    return this.apiClient.post<GetMessageResponseInterface>(paths.privateMessage.create, data);
  }
}
