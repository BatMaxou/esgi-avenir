import { UserRepositoryInterface } from "../repositories/UserRepositoryInterface"

export interface RepositoryResolverInterface {
  getUserRepository(): UserRepositoryInterface
}
