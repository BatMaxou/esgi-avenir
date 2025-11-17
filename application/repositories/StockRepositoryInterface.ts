import { RepositoryInterface } from "./RepositoryInterface"
import { Stock } from "../../domain/entities/Stock"

export interface StockRepositoryInterface extends RepositoryInterface {
  create: (stock: Stock) => Promise<Stock>
}
