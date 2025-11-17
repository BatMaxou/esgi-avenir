import { FinancialSecurity } from "../../domain/entities/FinancialSecurity"
import { UserNotFoundError } from "../../domain/errors/entities/user/UserNotFoundError"
import { RepositoryInterface } from "./RepositoryInterface"
import { StockNotFoundError } from "../../domain/errors/entities/stock/StockNotFoundError"

export interface FinancialSecurityRepositoryInterface extends RepositoryInterface {
  create: (financialSecurity: FinancialSecurity) => Promise<FinancialSecurity | StockNotFoundError | UserNotFoundError>
}
