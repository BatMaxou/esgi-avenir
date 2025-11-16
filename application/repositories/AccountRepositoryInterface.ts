import { Account } from "../../domain/entities/Account"
import { AccountNotFoundError } from "../../domain/errors/entities/account/AccountNotFoundError"
import { IbanExistsError } from "../../domain/errors/entities/account/IbanExistsError"
import { UserNotFoundError } from "../../domain/errors/entities/user/UserNotFoundError"
import { IbanValue } from "../../domain/values/IbanValue"
import { RepositoryInterface } from "./RepositoryInterface"
import { UserAlreadyHaveSavingsAccountError } from "../../domain/errors/entities/account/UserAlreadyHaveSavingsAccountError"

export interface AccountRepositoryInterface extends RepositoryInterface {
  create: (account: Account) => Promise<Account | IbanExistsError | UserNotFoundError | UserAlreadyHaveSavingsAccountError>
  update: (account: Partial<Account> & { id: number }) => Promise<Account | AccountNotFoundError>
  delete: (id: number) => Promise<boolean | AccountNotFoundError>
  findById: (id: number) => Promise<Account | AccountNotFoundError>
  findByIban: (iban: IbanValue) => Promise<Account | AccountNotFoundError>
  findAllByOwner: (ownerId: number) => Promise<Account[]>
  findNextId: () => Promise<number>
  findSavingsAccountByOwner: (ownerId: number) => Promise<Account | AccountNotFoundError>
  findSavingsAccountOwnerIds: () => Promise<number[]>
  findAllSavingsAccounts: () => Promise<Account[]>
}
