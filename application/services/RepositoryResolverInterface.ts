import { AccountRepositoryInterface } from "../repositories/AccountRepositoryInterface"
import { UserRepositoryInterface } from "../repositories/UserRepositoryInterface"
import { OperationRepositoryInterface } from "../repositories/OperationRepositoryInterface"
import { SettingRepositoryInterface } from "../repositories/SettingRepositoryInterface"
import { StockRepositoryInterface } from "../repositories/StockRepositoryInterface"
import { StockOrderRepositoryInterface } from "../repositories/StockOrderRepositoryInterface"
import { FinancialSecurityRepositoryInterface } from "../repositories/FinancialSecurityRepositoryInterface"
import { BeneficiaryRepositoryInterface } from "../repositories/BeneficiaryRepositoryInterface"

export interface RepositoryResolverInterface {
  getUserRepository(): UserRepositoryInterface
  getAccountRepository(): AccountRepositoryInterface
  getOperationRepository(): OperationRepositoryInterface
  getSettingRepository(): SettingRepositoryInterface
  getStockRepository(): StockRepositoryInterface
  getStockOrderRepository(): StockOrderRepositoryInterface
  getFinancialSecurityRepository(): FinancialSecurityRepositoryInterface
  getBeneficiaryRepository(): BeneficiaryRepositoryInterface
}
