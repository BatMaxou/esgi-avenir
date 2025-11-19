import { FinancialSecurity } from "../../domain/entities/FinancialSecurity"
import { UserNotFoundError } from "../../domain/errors/entities/user/UserNotFoundError"
import { RepositoryInterface } from "./RepositoryInterface"
import { StockNotFoundError } from "../../domain/errors/entities/stock/StockNotFoundError"
import { FinancialSecurityNotFoundError } from "../../domain/errors/entities/financial-security/FinancialSecurityNotFoundError"

export interface FinancialSecurityRepositoryInterface extends RepositoryInterface {
  create: (financialSecurity: FinancialSecurity) => Promise<FinancialSecurity | StockNotFoundError | UserNotFoundError>
  delete: (id: number) => Promise<boolean | FinancialSecurityNotFoundError>
  findById: (id: number) => Promise<FinancialSecurity | FinancialSecurityNotFoundError>
  findAllByOwner: (ownerId: number) => Promise<FinancialSecurity[]>
  findAllByStock: (stockId: number) => Promise<FinancialSecurity[]>
  findOneByStockAndOwner: (stockId: number, ownerId: number) => Promise<FinancialSecurity | FinancialSecurityNotFoundError>
}
