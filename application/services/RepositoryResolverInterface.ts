import { AccountRepositoryInterface } from "../repositories/AccountRepositoryInterface"
import { UserRepositoryInterface } from "../repositories/UserRepositoryInterface"
import { OperationRepositoryInterface } from "../repositories/OperationRepositoryInterface"

export interface RepositoryResolverInterface {
  getUserRepository(): UserRepositoryInterface
  getAccountRepository(): AccountRepositoryInterface
  getOperationRepository(): OperationRepositoryInterface
}
