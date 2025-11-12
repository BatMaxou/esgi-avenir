import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { ApiClientInterface, DeleteResponseInterface } from "../../../../application/services/api/ApiClientInterface";
import { paths } from "../../../../application/services/api/paths";
import { CreateAccountPayloadInterface, GetAccountListResponseInterface, GetAccountResponseInterface, UpdateAccountPayloadInterface, AccountResourceInterface } from "../../../../application/services/api/resources/AccountResourceInterface";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";

export class AccountResource implements AccountResourceInterface {
  constructor(private apiClient: ApiClientInterface) {}

  public async getAll(): Promise<GetAccountListResponseInterface | ApiClientError> {
    return this.apiClient.get<GetAccountListResponseInterface>(`${paths.account.list}`);
  }

  public async create(data: CreateAccountPayloadInterface): Promise<GetAccountResponseInterface | ApiClientError> {
    return this.apiClient.post<GetAccountResponseInterface>(`${paths.account.create}`, data);
  }

  public async update(data: UpdateAccountPayloadInterface): Promise<GetAccountResponseInterface | ApiClientError> {
    return this.apiClient.put<GetAccountResponseInterface>(`${paths.account.update(data.id)}`, data);
  }

  public async delete(id: number): Promise<DeleteResponseInterface | ApiClientError> {
    return this.apiClient.delete(`${paths.account.delete(id)}`);
  }
}
