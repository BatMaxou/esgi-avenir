import { ApiClientInterface } from "../../../../application/services/api/ApiClientInterface";
import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { MeResourceInterface } from "../../../../application/services/api/resources/MeResourceInterface";
import { paths } from "../../../../application/services/api/paths";
import type { User } from "../../../../domain/entities/User";

export class MeResource implements MeResourceInterface {
  constructor(private apiClient: ApiClientInterface) {}

  public async get(): Promise<User | ApiClientError> {
    return this.apiClient.get<User>(`${paths.me}`);
  }
}
