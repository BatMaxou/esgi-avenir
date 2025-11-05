import type { User } from '../../../../domain/entities/User';
import { RoleEnum } from '../../../../domain/enums/RoleEnum';
import { DeleteResponseInterface } from '../ApiClientInterface';

export interface GetUserResponseInterface extends Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'roles'> {}
export interface GetAllUsersResponseInterface extends Array<GetUserResponseInterface> {}

export interface CreateUserPayloadInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles?: RoleEnum[];
}

export interface UpdateUserPayloadInterface extends CreateUserPayloadInterface {
  id: number;
}

export interface UserResourceInterface {
  get(id: number): Promise<GetUserResponseInterface>;
  getAll(): Promise<GetAllUsersResponseInterface>;
  create(data: CreateUserPayloadInterface): Promise<GetUserResponseInterface>;
  update(data: UpdateUserPayloadInterface): Promise<GetUserResponseInterface>;
  delete(id: number): Promise<DeleteResponseInterface>;
}

