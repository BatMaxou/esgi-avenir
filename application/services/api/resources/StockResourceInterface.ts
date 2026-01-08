import { ApiClientError } from '../ApiClientError';
import type { Stock, HydratedStock } from '../../../../domain/entities/Stock';

export interface GetStockResponseInterface extends Stock {}
export interface GetHydratedStockResponseInterface extends HydratedStock {}
export interface GetStockListResponseInterface extends Array<GetHydratedStockResponseInterface> {}

export interface CreateStockPayloadInterface {
  name: string;
  baseQuantity: number;
  basePrice: number;
}

export interface UpdateStockPayloadInterface {
  id: number;
  name?: string;
  baseQuantity?: number;
}

export interface PurchaseBaseStockPayloadInterface {
  accountId: number;
}

export interface PurchaseBaseStockResponseInterface {
  success: boolean;
}

export interface StockResourceInterface {
  create(data: CreateStockPayloadInterface): Promise<GetStockResponseInterface | ApiClientError>;
  update(data: UpdateStockPayloadInterface): Promise<GetStockResponseInterface | ApiClientError>;
  getAll(term?: string): Promise<GetStockListResponseInterface | ApiClientError>;
  purchaseBaseStock(id: number, data: PurchaseBaseStockPayloadInterface): Promise<PurchaseBaseStockResponseInterface | ApiClientError>;
}

