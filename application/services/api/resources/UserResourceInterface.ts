import type { User } from '../../../../domain/entities/User';
import { RoleEnum } from '../../../../domain/enums/RoleEnum';
import { ApiClientError } from '../ApiClientError';
import { DeleteResponseInterface } from '../ApiClientInterface';

export interface GetUserResponseInterface extends Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'roles'> {}
export interface GetUserListResponseInterface extends Array<GetUserResponseInterface> {}

export interface CreateUserPayloadInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles?: RoleEnum[];
}

export interface UpdateUserPayloadInterface {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  roles?: RoleEnum[];
}

export interface UserResourceInterface {
  get(id: number): Promise<GetUserResponseInterface | ApiClientError>;
  getAll(): Promise<GetUserListResponseInterface | ApiClientError>;
  create(data: CreateUserPayloadInterface): Promise<GetUserResponseInterface | ApiClientError>;
  update(data: UpdateUserPayloadInterface): Promise<GetUserResponseInterface | ApiClientError>;
  delete(id: number): Promise<DeleteResponseInterface | ApiClientError>;
  ban(id: number): Promise<GetUserResponseInterface | ApiClientError>;
  unban(id: number): Promise<GetUserResponseInterface | ApiClientError>;
}

