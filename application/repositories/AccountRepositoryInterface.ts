import { Account } from "../../domain/entities/Account"
import { AccountNotFoundError } from "../../domain/errors/entities/account/AccountNotFoundError"
import { RepositoryInterface } from "./RepositoryInterface"

export interface AccountRepositoryInterface extends RepositoryInterface {
  create: (account: Account) => Promise<Account | AccountNotFoundError>
  update: (account: Partial<Account> & { id: number }) => Promise<Account | AccountNotFoundError>
  delete: (id: number) => Promise<boolean | AccountNotFoundError>
  findById: (id: number) => Promise<Account | AccountNotFoundError>
  findAllByOwner: (ownerId: number) => Promise<Account[]>
}
