import { StockOrder } from "../../domain/entities/StockOrder"
import { UserNotFoundError } from "../../domain/errors/entities/user/UserNotFoundError"
import { RepositoryInterface } from "./RepositoryInterface"
import { StockNotFoundError } from "../../domain/errors/entities/stock/StockNotFoundError"
import { StockOrderNotFoundError } from "../../domain/errors/entities/stock-order/StockOrderNotFoundError"
import { AccountNotFoundError } from "../../domain/errors/entities/account/AccountNotFoundError"
import { StockOrderTypeEnum } from "../../domain/enums/StockOrderTypeEnum"

export type UpdateStockOrderPayload = Omit<
  Partial<StockOrder>,
  'amount' | 'type' | 'ownerId' | 'stockId' | 'accountId' | 'owner' | 'stock' | 'account'
> & { id: number }

export interface StockOrderRepositoryInterface extends RepositoryInterface {
  create: (stockOrder: StockOrder) => Promise<StockOrder | StockNotFoundError | UserNotFoundError | AccountNotFoundError>
  update: (stockOrder: UpdateStockOrderPayload) => Promise<StockOrder | StockOrderNotFoundError>
  delete: (id: number) => Promise<boolean | StockOrderNotFoundError>
  findById: (id: number) => Promise<StockOrder | StockOrderNotFoundError>
  findAllByOwner: (ownerId: number) => Promise<StockOrder[]>
  findMatchByStock: (stockId: number, type: StockOrderTypeEnum) => Promise<StockOrder[]>
  findCompletedByStock: (stockId: number) => Promise<StockOrder[]>
}

