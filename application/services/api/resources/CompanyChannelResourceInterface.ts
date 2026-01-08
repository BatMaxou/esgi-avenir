import { ApiClientError } from '../ApiClientError';
import { HydratedCompanyChannel, CompanyChannel } from '../../../../domain/entities/CompanyChannel';
import { GetMessageResponseInterface } from './MessageResourceInterface';

export interface GetCompanyChannelResponseInterface extends CompanyChannel {}
export interface GetHydratedCompanyChannelResponseInterface extends HydratedCompanyChannel {}
export interface GetCompanyChannelListResponseInterface extends Array<GetCompanyChannelResponseInterface> {}

export interface CreateCompanyChannelPayloadInterface {
  title: string;
}

export interface UpdateCompanyChannelPayloadInterface {
  id: number;
  title?: string;
}

export interface WriteCompanyMessagePayloadInterface {
  content: string;
}

export interface CompanyChannelResourceInterface {
  get(id: number): Promise<GetHydratedCompanyChannelResponseInterface | ApiClientError>;
  getAll(): Promise<GetCompanyChannelListResponseInterface | ApiClientError>;
  create(data: CreateCompanyChannelPayloadInterface): Promise<GetCompanyChannelResponseInterface | ApiClientError>;
  update(data: UpdateCompanyChannelPayloadInterface): Promise<GetCompanyChannelResponseInterface | ApiClientError>;
  writeMessage(data: WriteCompanyMessagePayloadInterface): Promise<GetMessageResponseInterface | ApiClientError>;
}

