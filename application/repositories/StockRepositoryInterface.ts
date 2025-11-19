import { RepositoryInterface } from "./RepositoryInterface"
import { Stock } from "../../domain/entities/Stock"
import { StockNotFoundError } from "../../domain/errors/entities/stock/StockNotFoundError"

export type UpdateStockPayload = Omit<Partial<Stock>, 'basePrice'> & { id: number }

export interface StockRepositoryInterface extends RepositoryInterface {
  create: (stock: Stock) => Promise<Stock>
  update: (stock: UpdateStockPayload) => Promise<Stock | StockNotFoundError>
  findById: (id: number) => Promise<Stock | StockNotFoundError>
  findAllLike: (term: string) => Promise<Stock[]>
}
