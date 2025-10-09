import { RepositoryInterface } from "../../../application/repositories/RepositoryInterface";
import { UserRepositoryInterface } from "../../../application/repositories/UserRepositoryInterface";
import { RepositoryResolverInterface } from "../../../application/services/RepositoryResolverInterface";
import { MariadbUserRepository } from "../repositories/mariadb/MariadbUserRepository";

type RepositoryFactory<T extends RepositoryInterface> = () => T;

const repositoryFactories: Record<string, Record<string, RepositoryFactory<RepositoryInterface>>> = {
  mysql: {
    UserRepository: () => new MariadbUserRepository(),
  },
  // mongodb: {
  //   UserRepository: () => new MongodbUserRepository(),
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
