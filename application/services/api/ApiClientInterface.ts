import type { User } from '../../../domain/entities/User';
import { MeResourceInterface } from './resources/MeResourceInterface';

export interface LoginResponseInterface {
  token: string;
}

export interface ApiClientInterface {
  me: MeResourceInterface;

  get<T>(url: string, additionnalHeaders?: HeadersInit): Promise<T>;
  post<T>(url: string, body: object, additionnalHeaders?: HeadersInit,): Promise<T>;
  login(email: string, password: string): Promise<LoginResponseInterface>;
  logout(): void;
}
