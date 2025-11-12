import { Operation } from "../../domain/entities/Operation"
import { AccountNotFoundError } from "../../domain/errors/entities/account/AccountNotFoundError"
import { RepositoryInterface } from "./RepositoryInterface"

export interface OperationRepositoryInterface extends RepositoryInterface {
  create: (operation: Operation) => Promise<Operation | AccountNotFoundError>
  findByAccount: (accountId: number) => Promise<Operation[] | AccountNotFoundError>
}
