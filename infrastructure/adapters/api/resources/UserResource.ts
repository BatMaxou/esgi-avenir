import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { ApiClientInterface, DeleteResponseInterface } from "../../../../application/services/api/ApiClientInterface";
import { paths } from "../../../../application/services/api/paths";
import { CreateUserPayloadInterface, GetUserListResponseInterface, GetUserResponseInterface, UpdateUserPayloadInterface, UserResourceInterface } from "../../../../application/services/api/resources/UserResourceInterface";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";

export class UserResource implements UserResourceInterface {
  constructor(private apiClient: ApiClientInterface) {}

  public async get(id: number): Promise<GetUserResponseInterface | ApiClientError> {
    return this.apiClient.get<GetUserResponseInterface>(`${paths.user.detail(id)}`);
  }

  public async getAll(): Promise<GetUserListResponseInterface | ApiClientError> {
    return this.apiClient.get<GetUserListResponseInterface>(`${paths.user.list}`);
  }

  public async create(data: CreateUserPayloadInterface): Promise<GetUserResponseInterface | ApiClientError> {
    return this.apiClient.post<GetUserResponseInterface>(`${paths.user.create}`, data);
  }

  public async update(data: UpdateUserPayloadInterface): Promise<GetUserResponseInterface | ApiClientError> {
    return this.apiClient.put<GetUserResponseInterface>(`${paths.user.update(data.id)}`, data);
  }

  public async delete(id: number): Promise<DeleteResponseInterface | ApiClientError> {
    return this.apiClient.delete(`${paths.user.delete(id)}`);
  }

  public async ban(id: number): Promise<GetUserResponseInterface | ApiClientError> {
    return this.update({ id, roles: [RoleEnum.BANNED] });
  }

  public async unban(id: number): Promise<GetUserResponseInterface | ApiClientError> {
    return this.apiClient.post<GetUserResponseInterface>(`${paths.user.unban(id)}`, {});
  }
}
