import { MeResourceInterface } from './resources/MeResourceInterface';

export interface LoginResponseInterface {
  token: string;
}

export interface RegisterResponseInterface {
  success: boolean;
}

export interface ApiClientInterface {
  me: MeResourceInterface;

  get<T>(url: string, additionnalHeaders?: HeadersInit): Promise<T>;
  post<T>(url: string, body: object, additionnalHeaders?: HeadersInit,): Promise<T>;
  login(email: string, password: string): Promise<LoginResponseInterface>;
  register(email: string, password: string, firstName: string, lastName: string): Promise<RegisterResponseInterface>;
  logout(): void;
}
