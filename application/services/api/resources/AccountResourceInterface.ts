import { ApiClientError } from '../ApiClientError';
import { DeleteResponseInterface } from '../ApiClientInterface';
import type { Account } from '../../../../domain/entities/Account';

export interface GetAccountResponseInterface extends Account {}
export interface GetAccountListResponseInterface extends Array<GetAccountResponseInterface> {}

export interface CreateAccountPayloadInterface {
  name: string;
}

export interface UpdateAccountPayloadInterface {
  id: number;
  name?: string;
}

export interface AccountResourceInterface {
  getAll(): Promise<GetAccountListResponseInterface | ApiClientError>;
  create(data: CreateAccountPayloadInterface): Promise<GetAccountResponseInterface | ApiClientError>;
  update(data: UpdateAccountPayloadInterface): Promise<GetAccountResponseInterface | ApiClientError>;
  delete(id: number): Promise<DeleteResponseInterface | ApiClientError>;
}

