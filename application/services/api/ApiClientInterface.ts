import { ApiClientError } from './ApiClientError';
import { AccountResourceInterface } from './resources/AccountResourceInterface';
import { BeneficiaryResourceInterface } from './resources/BeneficiaryResourceInterface';
import { FinancialSecurityResourceInterface } from './resources/FinancialSecurityResourceInterface';
import { MeResourceInterface } from './resources/MeResourceInterface';
import { OperationResourceInterface } from './resources/OperationResourceInterface';
import { SettingResourceInterface } from './resources/SettingResourceInterface';
import { StockResourceInterface } from './resources/StockResourceInterface';
import { UserResourceInterface } from './resources/UserResourceInterface';
import { StockOrderResourceInterface } from './resources/StockOrderResourceInterface';
import { BankCreditResourceInterface } from './resources/BankCreditResourceInterface';
import { NewsResourceInterface } from './resources/NewsResourceInterface';
import { CompanyChannelResourceInterface } from './resources/CompanyChannelResourceInterface';
import { PrivateChannelResourceInterface } from './resources/PrivateChannelResourceInterface';
import { PrivateMessageResourceInterface } from './resources/PrivateMessageResourceInterface';
import { NotificationResourceInterface } from './resources/NotificationResourceInterface';

export interface LoginResponseInterface {
  token: string;
}

export interface RegisterResponseInterface {
  success: boolean;
}

export interface ConfirmResponseInterface {
  success: boolean;
}

export interface DeleteResponseInterface {
  success: boolean;
}

export interface ApiClientInterface {
  me: MeResourceInterface;
  user: UserResourceInterface;
  account: AccountResourceInterface;
  operation: OperationResourceInterface;
  setting: SettingResourceInterface;
  stock: StockResourceInterface;
  stockOrder: StockOrderResourceInterface;
  financialSecurity: FinancialSecurityResourceInterface;
  beneficiary: BeneficiaryResourceInterface;
  bankCredit: BankCreditResourceInterface;
  news: NewsResourceInterface;
  companyChannel: CompanyChannelResourceInterface;
  privateChannel: PrivateChannelResourceInterface;
  privateMessage: PrivateMessageResourceInterface;
  notification: NotificationResourceInterface;

  get<T>(url: string, additionnalHeaders?: HeadersInit): Promise<T | ApiClientError>;
  post<T>(url: string, body: object, additionnalHeaders?: HeadersInit,): Promise<T | ApiClientError>;
  put<T>(url: string, body: object, additionnalHeaders?: HeadersInit): Promise<T | ApiClientError>;
  delete(url: string): Promise<DeleteResponseInterface | ApiClientError>;
  login(email: string, password: string): Promise<LoginResponseInterface | ApiClientError>;
  register(email: string, password: string, firstName: string, lastName: string): Promise<RegisterResponseInterface | ApiClientError>;
  confirm(token: string): Promise<ConfirmResponseInterface | ApiClientError>;
  logout(): void;
}
