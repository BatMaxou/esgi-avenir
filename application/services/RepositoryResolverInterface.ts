import { AccountRepositoryInterface } from "../repositories/AccountRepositoryInterface"
import { UserRepositoryInterface } from "../repositories/UserRepositoryInterface"
import { OperationRepositoryInterface } from "../repositories/OperationRepositoryInterface"
import { SettingRepositoryInterface } from "../repositories/SettingRepositoryInterface"
import { StockRepositoryInterface } from "../repositories/StockRepositoryInterface"
import { StockOrderRepositoryInterface } from "../repositories/StockOrderRepositoryInterface"
import { FinancialSecurityRepositoryInterface } from "../repositories/FinancialSecurityRepositoryInterface"
import { BeneficiaryRepositoryInterface } from "../repositories/BeneficiaryRepositoryInterface"
import { BankCreditRepositoryInterface } from "../repositories/BankCreditRepositoryInterface"
import { MonthlyPaymentRepositoryInterface } from "../repositories/MonthlyPaymentRepositoryInterface"
import { NewsRepositoryInterface } from "../repositories/NewsRepositoryInterface"
import { NotificationRepositoryInterface } from "../repositories/NotificationRepositoryInterface"
import { PrivateChannelRepositoryInterface } from "../repositories/PrivateChannelRepositoryInterface"
import { CompanyChannelRepositoryInterface } from "../repositories/CompanyChannelRepositoryInterface"
import { MessageRepositoryInterface } from "../repositories/MessageRepositoryInterface"

export interface RepositoryResolverInterface {
  getUserRepository(): UserRepositoryInterface
  getAccountRepository(): AccountRepositoryInterface
  getOperationRepository(): OperationRepositoryInterface
  getSettingRepository(): SettingRepositoryInterface
  getStockRepository(): StockRepositoryInterface
  getStockOrderRepository(): StockOrderRepositoryInterface
  getFinancialSecurityRepository(): FinancialSecurityRepositoryInterface
  getBeneficiaryRepository(): BeneficiaryRepositoryInterface
  getBankCreditRepository(): BankCreditRepositoryInterface
  getMonthlyPaymentRepository(): MonthlyPaymentRepositoryInterface
  getNewsRepository(): NewsRepositoryInterface
  getNotificationRepository(): NotificationRepositoryInterface
  getPrivateChannelRepository():PrivateChannelRepositoryInterface
  getCompanyChannelRepository(): CompanyChannelRepositoryInterface
  getMessageRepository(): MessageRepositoryInterface
}
