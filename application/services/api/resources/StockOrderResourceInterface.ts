import { ApiClientError } from '../ApiClientError';
import { DeleteResponseInterface } from '../ApiClientInterface';
import { StockOrderTypeEnum } from '../../../../domain/enums/StockOrderTypeEnum';
import { StockOrder } from '../../../../domain/entities/StockOrder';

export interface GetStockOrderResponseInterface extends StockOrder {}
export interface GetStockOrderListResponseInterface extends Array<GetStockOrderResponseInterface> {}

export interface CreateStockOrderPayloadInterface {
  stockId: number;
  accountId: number;
  type: StockOrderTypeEnum;
  amount: number;
}

export interface AcceptStockOrderResponseInterface {
  success: boolean;
}

export interface StockOrderResourceInterface {
  create(data: CreateStockOrderPayloadInterface): Promise<GetStockOrderResponseInterface | ApiClientError>;
  delete(id: number): Promise<DeleteResponseInterface | ApiClientError>;
  accept(id: number, withId: number): Promise<AcceptStockOrderResponseInterface | ApiClientError>;
  getAll(): Promise<GetStockOrderListResponseInterface | ApiClientError>;
  match(id: number): Promise<GetStockOrderListResponseInterface | ApiClientError>;
}

