import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { ApiClientInterface, DeleteResponseInterface } from "../../../../application/services/api/ApiClientInterface";
import { paths } from "../../../../application/services/api/paths";
import { CreateAccountPayloadInterface, GetAccountListResponseInterface, GetAccountResponseInterface, UpdateAccountPayloadInterface, AccountResourceInterface, GetHydratedAccountResponseInterface, GetByUserPayloadInterface } from "../../../../application/services/api/resources/AccountResourceInterface";
import { GetOperationListResponseInterface } from "../../../../application/services/api/resources/OperationResourceInterface";

export class AccountResource implements AccountResourceInterface {
  constructor(private apiClient: ApiClientInterface) {}

  public async get(id: number): Promise<GetHydratedAccountResponseInterface | ApiClientError> {
    return this.apiClient.get<GetHydratedAccountResponseInterface>(paths.account.detail(id));
  }

  public async getAll(): Promise<GetAccountListResponseInterface | ApiClientError> {
    return this.apiClient.get<GetAccountListResponseInterface>(paths.account.list);
  }

  public async create(data: CreateAccountPayloadInterface): Promise<GetAccountResponseInterface | ApiClientError> {
    return this.apiClient.post<GetAccountResponseInterface>(paths.account.create, data);
  }

  public async createSavings(data: CreateAccountPayloadInterface): Promise<GetAccountResponseInterface | ApiClientError> {
    return this.apiClient.post<GetAccountResponseInterface>(paths.account.createSavings, data);
  }

  public async update(data: UpdateAccountPayloadInterface): Promise<GetAccountResponseInterface | ApiClientError> {
    return this.apiClient.put<GetAccountResponseInterface>(paths.account.update(data.id), data);
  }

  public async delete(id: number): Promise<DeleteResponseInterface | ApiClientError> {
    return this.apiClient.delete(paths.account.delete(id));
  }

  public async getOperations(id: number): Promise<GetOperationListResponseInterface | ApiClientError> {
    return this.apiClient.get<GetOperationListResponseInterface>(paths.account.operations(id));
  }

  public async getByUser(data: GetByUserPayloadInterface): Promise<GetAccountListResponseInterface | ApiClientError> {
    return this.apiClient.get<GetAccountListResponseInterface>(paths.account.byUser, data);
  }
}
