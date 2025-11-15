import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { ApiClientInterface } from "../../../../application/services/api/ApiClientInterface";
import { paths } from "../../../../application/services/api/paths";
import { GetSettingListResponseInterface, GetSettingResponseInterface, SettingResourceInterface, UpsertSettingPayloadInterface } from "../../../../application/services/api/resources/SettingResourceInterface";

export class SettingResource implements SettingResourceInterface {
  constructor(private apiClient: ApiClientInterface) {}

  public async getAll(): Promise<GetSettingListResponseInterface | ApiClientError> {
    return this.apiClient.get<GetSettingListResponseInterface>(`${paths.setting.list}`);
  }

  public async upsert(data: UpsertSettingPayloadInterface): Promise<GetSettingResponseInterface | ApiClientError> {
    return this.apiClient.post<GetSettingResponseInterface>(`${paths.setting.upsert}`, data);
  }
}
