import { Beneficiary } from "../../domain/entities/Beneficiary"
import { BeneficiaryNotFoundError } from "../../domain/errors/entities/beneficiary/BeneficiaryNotFoundError"
import { UserNotFoundError } from "../../domain/errors/entities/user/UserNotFoundError"
import { RepositoryInterface } from "./RepositoryInterface"
import { AccountNotFoundError } from "../../domain/errors/entities/account/AccountNotFoundError"

export type UpdateBeneficiaryPayload = Omit<
  Partial<Beneficiary>,
  'ownerId' | 'accountId' | 'owner' | 'account'
> & { id: number }

export interface BeneficiaryRepositoryInterface extends RepositoryInterface {
  create: (beneficiary: Beneficiary) => Promise<Beneficiary | UserNotFoundError | AccountNotFoundError>
  update: (beneficiary: UpdateBeneficiaryPayload) => Promise<Beneficiary | BeneficiaryNotFoundError>
  delete: (id: number) => Promise<boolean | BeneficiaryNotFoundError>
  findById: (id: number) => Promise<Beneficiary | BeneficiaryNotFoundError>
  findAllByOwnerLike: (ownerId: number, term: string) => Promise<Beneficiary[]>
}
