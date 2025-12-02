import { AccountRepositoryInterface } from "../../../application/repositories/AccountRepositoryInterface";
import { RepositoryInterface } from "../../../application/repositories/RepositoryInterface";
import { UserRepositoryInterface } from "../../../application/repositories/UserRepositoryInterface";
import { RepositoryResolverInterface } from "../../../application/services/RepositoryResolverInterface";
import { MariadbUserRepository } from "../../adapters/mariadb/repositories/MariadbUserRepository";
import { MariadbAccountRepository } from "../mariadb/repositories/MariadbAccountRepository";
import { OperationRepositoryInterface } from "../../../application/repositories/OperationRepositoryInterface";
import { MariadbOperationRepository } from "../../adapters/mariadb/repositories/MariadbOperationRepository";
import { MariadbSettingRepository } from "../../adapters/mariadb/repositories/MariadbSettingRepository";
import { MariadbStockRepository } from "../mariadb/repositories/MariadbStockRepository";
import { MariadbStockOrderRepository } from "../mariadb/repositories/MariadbStockOrderRepository";
import { MariadbFinancialSecurityRepository } from "../mariadb/repositories/MariadbFinancialSecurityRepository";
import { MariadbBeneficiaryRepository } from "../mariadb/repositories/MariadbBeneficiaryRepository";
import { MariadbBankCreditRepository } from "../mariadb/repositories/MariadbBankCreditRepository";
import { MariadbMonthlyPaymentRepository } from "../mariadb/repositories/MariadbMonthlyPaymentRepository";
import { MariadbNewsRepository } from "../mariadb/repositories/MariadbNewsRepository";
import { SettingRepositoryInterface } from "../../../application/repositories/SettingRepositoryInterface";
import { StockRepositoryInterface } from "../../../application/repositories/StockRepositoryInterface";
import { StockOrderRepositoryInterface } from "../../../application/repositories/StockOrderRepositoryInterface";
import { FinancialSecurityRepositoryInterface } from "../../../application/repositories/FinancialSecurityRepositoryInterface";
import { BeneficiaryRepositoryInterface } from "../../../application/repositories/BeneficiaryRepositoryInterface";
import { BankCreditRepositoryInterface } from "../../../application/repositories/BankCreditRepositoryInterface";
import { MonthlyPaymentRepositoryInterface } from "../../../application/repositories/MonthlyPaymentRepositoryInterface";
import { NewsRepositoryInterface } from "../../../application/repositories/NewsRepositoryInterface";
import { MariadbCompanyChannelRepository } from "../mariadb/repositories/MariadbCompanyChannelRepository";
import { MariadbPrivateChannelRepository } from "../mariadb/repositories/MariadbPrivateChannelRepository";
import { MariadbMessageRepository } from "../mariadb/repositories/MariadbMessageRepository";
import { MariadbNotificationRepository } from "../mariadb/repositories/MariadbNotificationRepository";
import { CompanyChannelRepositoryInterface } from "../../../application/repositories/CompanyChannelRepositoryInterface";
import { PrivateChannelRepositoryInterface } from "../../../application/repositories/PrivateChannelRepositoryInterface";
import { MessageRepositoryInterface } from "../../../application/repositories/MessageRepositoryInterface";
import { NotificationRepositoryInterface } from "../../../application/repositories/NotificationRepositoryInterface";

type RepositoryFactory<T extends RepositoryInterface> = () => T;

const repositoryFactories: Record<string, Record<string, RepositoryFactory<RepositoryInterface>>> = {
  mysql: {
    UserRepository: () => new MariadbUserRepository(),
    AccountRepository: () => new MariadbAccountRepository(),
    OperationRepository: () => new MariadbOperationRepository(),
    SettingRepository: () => new MariadbSettingRepository(),
    StockRepository: () => new MariadbStockRepository(),
    StockOrderRepository: () => new MariadbStockOrderRepository(),
    FinancialSecurityRepository: () => new MariadbFinancialSecurityRepository(),
    BeneficiaryRepository: () => new MariadbBeneficiaryRepository(),
    BankCreditRepository: () => new MariadbBankCreditRepository(),
    MonthlyPaymentRepository: () => new MariadbMonthlyPaymentRepository(),
    NewsRepository: () => new MariadbNewsRepository(),
    CompanyChannelRepository: () => new MariadbCompanyChannelRepository(),
    PrivateChannelRepository: () => new MariadbPrivateChannelRepository(),
    MessageRepository: () => new MariadbMessageRepository(),
    NotificationRepository: () => new MariadbNotificationRepository(),
  },
  // mongodb: {
  //   UserRepository: () => new MongodbUserRepository(),
  //   AccountRepository: () => new MongodbAccountRepository(),
  //   OperationRepository: () => new MongodbOperationRepository(),
  //   SettingRepository: () => new MongodbSettingRepository(),
  //   StockRepository: () => new MongodbStockRepository(),
  //   StockOrderRepository: () => new MongodbStockOrderRepository(),
  //   FinancialSecurityRepository: () => new MongodbFinancialSecurityRepository(),
  //   BeneficiaryRepository: () => new MongodbBeneficiaryRepository(),
  //   BankCreditRepository: () => new MongodbBankCreditRepository(),
  //   MonthlyPaymentRepository: () => new MongodbMonthlyPaymentRepository(),
  //   NewsRepository: () => new MongodbNewsRepository(),
  //   CompanyChannelRepository: () => new MongodbCompanyChannelRepository(),
  //   PrivateChannelRepository: () => new MongodbPrivateChannelRepository(),
  //   MessageRepository: () => new MongodbMessageRepository(),
  //   NotificationRepository: () => new MongodbNotificationRepository(),
  // },
};

export class RepositoryResolver implements RepositoryResolverInterface {
  private instances: Map<string, RepositoryInterface> = new Map();

  public constructor(private readonly source: string) {
    if (!repositoryFactories[this.source]) {
      throw new Error(`Unsupported database source: ${this.source}`);
    }
  }

  public getUserRepository(): UserRepositoryInterface {
    return this.getRepository<UserRepositoryInterface>('UserRepository');
  }

  public getAccountRepository(): AccountRepositoryInterface {
    return this.getRepository<AccountRepositoryInterface>('AccountRepository');
  }

  public getOperationRepository(): OperationRepositoryInterface {
    return this.getRepository<OperationRepositoryInterface>('OperationRepository');
  }

  public getSettingRepository(): SettingRepositoryInterface {
    return this.getRepository<MariadbSettingRepository>('SettingRepository');
  }

  public getStockRepository(): StockRepositoryInterface {
    return this.getRepository<MariadbStockRepository>('StockRepository');
  }

  public getStockOrderRepository(): StockOrderRepositoryInterface {
    return this.getRepository<MariadbStockOrderRepository>('StockOrderRepository');
  }

  public getFinancialSecurityRepository(): FinancialSecurityRepositoryInterface {
    return this.getRepository<MariadbFinancialSecurityRepository>('FinancialSecurityRepository');
  }

  public getBeneficiaryRepository(): BeneficiaryRepositoryInterface {
    return this.getRepository<MariadbBeneficiaryRepository>('BeneficiaryRepository');
  }

  public getBankCreditRepository(): BankCreditRepositoryInterface {
    return this.getRepository<MariadbBankCreditRepository>('BankCreditRepository');
  }

  public getMonthlyPaymentRepository(): MonthlyPaymentRepositoryInterface {
    return this.getRepository<MariadbMonthlyPaymentRepository>('MonthlyPaymentRepository');
  }

  public getNewsRepository(): NewsRepositoryInterface {
    return this.getRepository<MariadbNewsRepository>('NewsRepository');
  }

  public getCompanyChannelRepository(): CompanyChannelRepositoryInterface {
    return this.getRepository<MariadbCompanyChannelRepository>('CompanyChannelRepository');
  }

  public getPrivateChannelRepository(): PrivateChannelRepositoryInterface {
    return this.getRepository<MariadbPrivateChannelRepository>('PrivateChannelRepository');
  }

  public getMessageRepository(): MessageRepositoryInterface {
    return this.getRepository<MariadbMessageRepository>('MessageRepository');
  }

  public getNotificationRepository(): NotificationRepositoryInterface {
    return this.getRepository<MariadbNotificationRepository>('NotificationRepository');
  }

  private getRepository<T extends RepositoryInterface>(name: string): T {
    const cacheKey = `${this.source}:${name}`;
    if (this.instances.has(cacheKey)) {
      return this.instances.get(cacheKey) as T;
    }

    const factory = repositoryFactories[this.source]?.[name];
    if (!factory) {
      throw new Error(`Repository "${name}" not available for source "${this.source}"`);
    }

    const instance = factory();
    this.instances.set(cacheKey, instance);

    return instance as T;
  }
}
