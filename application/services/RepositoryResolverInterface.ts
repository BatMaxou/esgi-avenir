import { AccountRepositoryInterface } from "../repositories/AccountRepositoryInterface"
import { UserRepositoryInterface } from "../repositories/UserRepositoryInterface"

export interface RepositoryResolverInterface {
  getUserRepository(): UserRepositoryInterface
  getAccountRepository(): AccountRepositoryInterface
}
