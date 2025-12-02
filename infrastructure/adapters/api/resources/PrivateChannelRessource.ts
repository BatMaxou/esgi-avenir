import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { ApiClientInterface } from "../../../../application/services/api/ApiClientInterface";
import { paths } from "../../../../application/services/api/paths";
import { UpdatePrivateChannelPayloadInterface, GetHydratedPrivateChannelResponseInterface, GetPrivateChannelListResponseInterface, GetPrivateChannelResponseInterface, PrivateChannelResourceInterface, WritePrivateMessagePayloadInterface } from "../../../../application/services/api/resources/PrivateChannelResourceInterface";
import { GetMessageResponseInterface } from "../../../../application/services/api/resources/MessageResourceInterface";

export class PrivateChannelResource implements PrivateChannelResourceInterface {
  constructor(private apiClient: ApiClientInterface) {}

  public async get(id: number): Promise<GetHydratedPrivateChannelResponseInterface | ApiClientError> {
    return this.apiClient.get<GetHydratedPrivateChannelResponseInterface>(paths.privateChannel.detail(id));
  }

  public async getAll(): Promise<GetPrivateChannelListResponseInterface | ApiClientError> {
    return this.apiClient.get<GetPrivateChannelListResponseInterface>(paths.privateChannel.list);
  }

  public async update(data: UpdatePrivateChannelPayloadInterface): Promise<GetPrivateChannelResponseInterface | ApiClientError> {
    return this.apiClient.put<GetPrivateChannelResponseInterface>(paths.privateChannel.update(data.id), data);
  }

  public async writeMessage(data: WritePrivateMessagePayloadInterface): Promise<GetMessageResponseInterface | ApiClientError> {
    return this.apiClient.put<GetMessageResponseInterface>(paths.privateChannel.writeMessage(data.channelId), data);
  }
}
