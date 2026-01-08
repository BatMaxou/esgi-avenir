import { ApiClientError } from '../ApiClientError';
import { GetMessageResponseInterface, MessageResourceInterface } from './MessageResourceInterface';

export interface CreatePrivateMessagePayloadInterface {
  // Title of channel
  title?: string;
  content?: string;
}

export interface PrivateMessageResourceInterface extends MessageResourceInterface {
  create(data: CreatePrivateMessagePayloadInterface): Promise<GetMessageResponseInterface | ApiClientError>;
}

