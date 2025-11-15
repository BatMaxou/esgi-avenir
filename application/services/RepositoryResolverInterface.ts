import { AccountRepositoryInterface } from "../repositories/AccountRepositoryInterface"
import { UserRepositoryInterface } from "../repositories/UserRepositoryInterface"
import { OperationRepositoryInterface } from "../repositories/OperationRepositoryInterface"
import { SettingRepositoryInterface } from "../repositories/SettingRepositoryInterface"

export interface RepositoryResolverInterface {
  getUserRepository(): UserRepositoryInterface
  getAccountRepository(): AccountRepositoryInterface
  getOperationRepository(): OperationRepositoryInterface
  getSettingRepository(): SettingRepositoryInterface
}
