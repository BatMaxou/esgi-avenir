import { ApiClientError } from '../ApiClientError';
import { DeleteResponseInterface } from '../ApiClientInterface';
import type { Account, HydratedAccount } from '../../../../domain/entities/Account';
import { GetOperationListResponseInterface } from './OperationResourceInterface';

export interface GetAccountResponseInterface extends Account {}
export interface GetHydratedAccountResponseInterface extends HydratedAccount {}
export interface GetAccountListResponseInterface extends Array<GetHydratedAccountResponseInterface> {}

export interface CreateAccountPayloadInterface {
  name: string;
}

export interface UpdateAccountPayloadInterface {
  id: number;
  name?: string;
}

export interface AccountResourceInterface {
  get(id: number): Promise<GetHydratedAccountResponseInterface | ApiClientError>;
  getAll(): Promise<GetAccountListResponseInterface | ApiClientError>;
  create(data: CreateAccountPayloadInterface): Promise<GetAccountResponseInterface | ApiClientError>;
  createSavings(data: CreateAccountPayloadInterface): Promise<GetAccountResponseInterface | ApiClientError>;
  update(data: UpdateAccountPayloadInterface): Promise<GetAccountResponseInterface | ApiClientError>;
  delete(id: number): Promise<DeleteResponseInterface | ApiClientError>;
  getOperations(id: number): Promise<GetOperationListResponseInterface | ApiClientError>;
}

