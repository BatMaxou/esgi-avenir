import { ApiClientError } from '../ApiClientError';
import { DeleteResponseInterface } from '../ApiClientInterface';
import type { News } from '../../../../domain/entities/News';

export interface GetNewsResponseInterface extends News {}
export interface GetNewsListResponseInterface extends Array<GetNewsResponseInterface> {}

export interface CreateNewsPayloadInterface {
  title: string;
  content: string;
}

export interface UpdateNewsPayloadInterface {
  id: number;
  title?: string;
  content?: string;
}

export interface NewsResourceInterface {
  get(id: number): Promise<GetNewsResponseInterface | ApiClientError>;
  getAll(term?: string, count?: number): Promise<GetNewsListResponseInterface | ApiClientError>;
  create(data: CreateNewsPayloadInterface): Promise<GetNewsResponseInterface | ApiClientError>;
  update(data: UpdateNewsPayloadInterface): Promise<GetNewsResponseInterface | ApiClientError>;
  delete(id: number): Promise<DeleteResponseInterface | ApiClientError>;
}

