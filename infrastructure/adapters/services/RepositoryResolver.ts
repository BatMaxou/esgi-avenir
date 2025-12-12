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

type RepositoryFactory<T extends RepositoryInterface> = (databaseDsn: string) => T;

const repositoryFactories: Record<string, Record<string, RepositoryFactory<RepositoryInterface>>> = {
  mysql: {
    UserRepository: (databaseDsn: string) => new MariadbUserRepository(databaseDsn),
    AccountRepository: (databaseDsn: string) => new MariadbAccountRepository(databaseDsn),
    OperationRepository: (databaseDsn: string) => new MariadbOperationRepository(databaseDsn),
    SettingRepository: (databaseDsn: string) => new MariadbSettingRepository(databaseDsn),
    StockRepository: (databaseDsn: string) => new MariadbStockRepository(databaseDsn),
    StockOrderRepository: (databaseDsn: string) => new MariadbStockOrderRepository(databaseDsn),
    FinancialSecurityRepository: (databaseDsn: string) => new MariadbFinancialSecurityRepository(databaseDsn),
    BeneficiaryRepository: (databaseDsn: string) => new MariadbBeneficiaryRepository(databaseDsn),
    BankCreditRepository: (databaseDsn: string) => new MariadbBankCreditRepository(databaseDsn),
    MonthlyPaymentRepository: (databaseDsn: string) => new MariadbMonthlyPaymentRepository(databaseDsn),
    NewsRepository: (databaseDsn: string) => new MariadbNewsRepository(databaseDsn),
    CompanyChannelRepository: (databaseDsn: string) => new MariadbCompanyChannelRepository(databaseDsn),
    PrivateChannelRepository: (databaseDsn: string) => new MariadbPrivateChannelRepository(databaseDsn),
    MessageRepository: (databaseDsn: string) => new MariadbMessageRepository(databaseDsn),
    NotificationRepository: (databaseDsn: string) => new MariadbNotificationRepository(databaseDsn),
  },
  // mongodb: {
  //   UserRepository: (databaseDsn: string) => new MongodbUserRepository(databaseDsn),
  //   AccountRepository: (databaseDsn: string) => new MongodbAccountRepository(databaseDsn),
  //   OperationRepository: (databaseDsn: string) => new MongodbOperationRepository(databaseDsn),
  //   SettingRepository: (databaseDsn: string) => new MongodbSettingRepository(databaseDsn),
  //   StockRepository: (databaseDsn: string) => new MongodbStockRepository(databaseDsn),
  //   StockOrderRepository: (databaseDsn: string) => new MongodbStockOrderRepository(databaseDsn),
  //   FinancialSecurityRepository: (databaseDsn: string) => new MongodbFinancialSecurityRepository(databaseDsn),
  //   BeneficiaryRepository: (databaseDsn: string) => new MongodbBeneficiaryRepository(databaseDsn),
  //   BankCreditRepository: (databaseDsn: string) => new MongodbBankCreditRepository(databaseDsn),
  //   MonthlyPaymentRepository: (databaseDsn: string) => new MongodbMonthlyPaymentRepository(databaseDsn),
  //   NewsRepository: (databaseDsn: string) => new MongodbNewsRepository(databaseDsn),
  //   CompanyChannelRepository: (databaseDsn: string) => new MongodbCompanyChannelRepository(databaseDsn),
  //   PrivateChannelRepository: (databaseDsn: string) => new MongodbPrivateChannelRepository(databaseDsn),
  //   MessageRepository: (databaseDsn: string) => new MongodbMessageRepository(databaseDsn),
  //   NotificationRepository: (databaseDsn: string) => new MongodbNotificationRepository(databaseDsn),
  // },
};

export class RepositoryResolver implements RepositoryResolverInterface {
  private instances: Map<string, RepositoryInterface> = new Map();

  public constructor(
    private readonly source: string,
    private readonly databaseDsn: string,
  ) {
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

    const instance = factory(this.databaseDsn);
    this.instances.set(cacheKey, instance);

    return instance as T;
  }
}
