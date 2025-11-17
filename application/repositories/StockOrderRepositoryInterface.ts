import { StockOrder } from "../../domain/entities/StockOrder"
import { UserNotFoundError } from "../../domain/errors/entities/user/UserNotFoundError"
import { RepositoryInterface } from "./RepositoryInterface"
import { StockNotFoundError } from "../../domain/errors/entities/stock/StockNotFoundError"

export interface StockOrderRepositoryInterface extends RepositoryInterface {
  create: (stockOrder: StockOrder) => Promise<StockOrder | StockNotFoundError | UserNotFoundError>
}
