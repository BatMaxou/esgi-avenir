import { AccountRepositoryInterface } from "../../../application/repositories/AccountRepositoryInterface";
import { RepositoryInterface } from "../../../application/repositories/RepositoryInterface";
import { UserRepositoryInterface } from "../../../application/repositories/UserRepositoryInterface";
import { RepositoryResolverInterface } from "../../../application/services/RepositoryResolverInterface";
import { MariadbUserRepository } from "../../adapters/mariadb/repositories/MariadbUserRepository";
import { MariadbAccountRepository } from "../mariadb/repositories/MariadbAccountRepository";
import { OperationRepositoryInterface } from "../../../application/repositories/OperationRepositoryInterface";
import { MariadbOperationRepository } from "../../adapters/mariadb/repositories/MariadbOperationRepository";

type RepositoryFactory<T extends RepositoryInterface> = () => T;

const repositoryFactories: Record<string, Record<string, RepositoryFactory<RepositoryInterface>>> = {
  mysql: {
    UserRepository: () => new MariadbUserRepository(),
    AccountRepository: () => new MariadbAccountRepository(),
    OperationRepository: () => new MariadbOperationRepository(),
  },
  // mongodb: {
  //   UserRepository: () => new MongodbUserRepository(),
  //   AccountRepository: () => new MongodbAccountRepository(),
  //   OperationRepository: () => new MongodbOperationRepository(),
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
