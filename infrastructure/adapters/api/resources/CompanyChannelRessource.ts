import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { ApiClientInterface } from "../../../../application/services/api/ApiClientInterface";
import { paths } from "../../../../application/services/api/paths";
import { GetHydratedCompanyChannelResponseInterface, GetCompanyChannelListResponseInterface, GetCompanyChannelResponseInterface, CompanyChannelResourceInterface, CreateCompanyChannelPayloadInterface, UpdateCompanyChannelPayloadInterface, WriteCompanyMessagePayloadInterface } from "../../../../application/services/api/resources/CompanyChannelResourceInterface";
import { GetMessageResponseInterface } from "../../../../application/services/api/resources/MessageResourceInterface";

export class CompanyChannelResource implements CompanyChannelResourceInterface {
  constructor(private apiClient: ApiClientInterface) {}

  public async get(id: number): Promise<GetHydratedCompanyChannelResponseInterface | ApiClientError> {
    return this.apiClient.get<GetHydratedCompanyChannelResponseInterface>(paths.companyChannel.detail(id));
  }

  public async getAll(): Promise<GetCompanyChannelListResponseInterface | ApiClientError> {
    return this.apiClient.get<GetCompanyChannelListResponseInterface>(paths.companyChannel.list);
  }

  public async create(data: CreateCompanyChannelPayloadInterface): Promise<GetCompanyChannelResponseInterface | ApiClientError> {
    return this.apiClient.post<GetCompanyChannelResponseInterface>(paths.companyChannel.create, data);
  }

  public async update(data: UpdateCompanyChannelPayloadInterface): Promise<GetCompanyChannelResponseInterface | ApiClientError> {
    return this.apiClient.put<GetCompanyChannelResponseInterface>(paths.companyChannel.update(data.id), data);
  }

  public async writeMessage(data: WriteCompanyMessagePayloadInterface): Promise<GetMessageResponseInterface | ApiClientError> {
    return this.apiClient.put<GetMessageResponseInterface>(paths.companyChannel.writeMessage(data.channelId), data);
  }
}
