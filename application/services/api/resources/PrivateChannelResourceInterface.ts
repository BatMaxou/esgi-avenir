import { ApiClientError } from '../ApiClientError';
import { HydratedPrivateChannel, PrivateChannel } from '../../../../domain/entities/PrivateChannel';
import { GetMessageResponseInterface } from './MessageResourceInterface';

export interface GetPrivateChannelResponseInterface extends PrivateChannel {}
export interface GetHydratedPrivateChannelResponseInterface extends HydratedPrivateChannel {}
export interface GetPrivateChannelListResponseInterface extends Array<GetPrivateChannelResponseInterface> {}

export interface UpdatePrivateChannelPayloadInterface {
  id: number;
  title?: string;
}

export interface AttributePrivateChannelToResponseInterface {
  success: boolean;
}

export interface WritePrivateMessagePayloadInterface {
  id: number;
  content: string;
}

export interface PrivateChannelResourceInterface {
  get(id: number): Promise<GetHydratedPrivateChannelResponseInterface | ApiClientError>;
  getAll(): Promise<GetPrivateChannelListResponseInterface | ApiClientError>;
  update(data: UpdatePrivateChannelPayloadInterface): Promise<GetPrivateChannelResponseInterface | ApiClientError>;
  attributeTo(id: number): Promise<AttributePrivateChannelToResponseInterface | ApiClientError>;
  writeMessage(data: WritePrivateMessagePayloadInterface): Promise<GetMessageResponseInterface | ApiClientError>;
}

