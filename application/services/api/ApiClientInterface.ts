import { ApiClientError } from './ApiClientError';
import { MeResourceInterface } from './resources/MeResourceInterface';
import { UserResourceInterface } from './resources/UserResourceInterface';

export interface LoginResponseInterface {
  token: string;
}

export interface RegisterResponseInterface {
  success: boolean;
}

export interface ConfirmResponseInterface {
  success: boolean;
}

export interface DeleteResponseInterface {
  success: boolean;
}

export interface ApiClientInterface {
  me: MeResourceInterface;
  user: UserResourceInterface;

  get<T>(url: string, additionnalHeaders?: HeadersInit): Promise<T | ApiClientError>;
  post<T>(url: string, body: object, additionnalHeaders?: HeadersInit,): Promise<T | ApiClientError>;
  put<T>(url: string, body: object, additionnalHeaders?: HeadersInit): Promise<T | ApiClientError>;
  delete(url: string): Promise<DeleteResponseInterface | ApiClientError>;
  login(email: string, password: string): Promise<LoginResponseInterface | ApiClientError>;
  register(email: string, password: string, firstName: string, lastName: string): Promise<RegisterResponseInterface | ApiClientError>;
  confirm(token: string): Promise<ConfirmResponseInterface | ApiClientError>;
  logout(): void;
}
