import { Account } from "../../domain/entities/Account"
import { UserNotFoundError } from "../../domain/errors/entities/user/UserNotFoundError"
import { RepositoryInterface } from "./RepositoryInterface"

export interface AccountRepositoryInterface extends RepositoryInterface {
  create: (account: Account) => Promise<Account | UserNotFoundError>
}
