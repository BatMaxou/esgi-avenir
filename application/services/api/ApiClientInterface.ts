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

  get<T>(url: string, additionnalHeaders?: HeadersInit): Promise<T>;
  post<T>(url: string, body: object, additionnalHeaders?: HeadersInit,): Promise<T>;
  put<T>(url: string, body: object, additionnalHeaders?: HeadersInit): Promise<T>;
  delete(url: string): Promise<DeleteResponseInterface>;
  login(email: string, password: string): Promise<LoginResponseInterface>;
  register(email: string, password: string, firstName: string, lastName: string): Promise<RegisterResponseInterface>;
  confirm(token: string): Promise<ConfirmResponseInterface>;
  logout(): void;
}
