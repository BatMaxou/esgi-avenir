import { ApiClientInterface } from "../../../../../application/services/api/ApiClientInterface";
import { paths } from "../../../../../application/services/api/paths";
import { MeResourceInterface } from "../../../../../application/services/api/resources/MeResourceInterface";
import type { User } from "../../../../../domain/entities/User";

export class MeResource implements MeResourceInterface {
  constructor(private apiClient: ApiClientInterface) {}

  public async get(): Promise<User> {
    return this.apiClient.get<User>(`${paths.me}`);
  }
}

