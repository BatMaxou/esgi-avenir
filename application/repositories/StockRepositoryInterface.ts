import { RepositoryInterface } from "./RepositoryInterface"
import { Stock } from "../../domain/entities/Stock"
import { StockNotFoundError } from "../../domain/errors/entities/stock/StockNotFoundError"

export interface StockRepositoryInterface extends RepositoryInterface {
  create: (stock: Stock) => Promise<Stock>
  update: (stock: Omit<Partial<Stock>, 'basePrice'> & { id: number }) => Promise<Stock | StockNotFoundError>
  findById: (id: number) => Promise<Stock | StockNotFoundError>
}
