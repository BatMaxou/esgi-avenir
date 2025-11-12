import { ApiClientError } from '../ApiClientError';
import { HydratedOperation, Operation } from '../../../../domain/entities/Operation';
import { OperationEnum } from '../../../../domain/enums/OperationEnum';

export interface GetOperationResponseInterface extends Operation {}
export interface GetHydratedOperationResponseInterface extends HydratedOperation {}
export interface GetOperationListResponseInterface extends Array<GetHydratedOperationResponseInterface> {}

export interface CreateOperationPayloadInterface {
  type: OperationEnum;
  amount: number;
  fromId: number;
  toId: number;
}

export interface OperationResourceInterface {
  create(data: CreateOperationPayloadInterface): Promise<GetOperationResponseInterface | ApiClientError>;
}

