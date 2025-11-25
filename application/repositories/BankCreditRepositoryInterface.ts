import { BankCredit } from "../../domain/entities/BankCredit"
import { AccountNotFoundError } from "../../domain/errors/entities/account/AccountNotFoundError"
import { BankCreditNotFoundError } from "../../domain/errors/entities/bank-credit/BankCreditNotFoundError"
import { InvalidAmountError } from "../../domain/errors/entities/bank-credit/InvalidAmountError"
import { InvalidDurationInMonthsError } from "../../domain/errors/entities/bank-credit/InvalidDurationInMonthsError"
import { InvalidInsurancePercentageError } from "../../domain/errors/entities/bank-credit/InvalidInsurancePercentageError"
import { InvalidInterestPercentageError } from "../../domain/errors/entities/bank-credit/InvalidInterestPercentageError"
import { UserNotFoundError } from "../../domain/errors/entities/user/UserNotFoundError"
import { RepositoryInterface } from "./RepositoryInterface"

export type UpdateBankCreditPayload = Omit<
  Partial<BankCredit>,
  'amount' | 'insurancePercentage' | 'interestPercentage' | 'durationInMonths' | 'accountId' | 'account' | 'advisorId' | 'advisor' | 'ownerId' | 'owner'
> & { id: number }

export interface BankCreditRepositoryInterface extends RepositoryInterface {
  create: (bankCredit: BankCredit) => Promise<BankCredit | UserNotFoundError | AccountNotFoundError | InvalidAmountError | InvalidInterestPercentageError | InvalidInsurancePercentageError | InvalidDurationInMonthsError>;
  update: (account: UpdateBankCreditPayload) => Promise<BankCredit | BankCreditNotFoundError>;
  findById: (id: number) => Promise<BankCredit | BankCreditNotFoundError>
  findAllByOwner: (ownerId: number) => Promise<BankCredit[]>
  findAllByAdvisor: (advisorId: number) => Promise<BankCredit[]>
  findAllNotCompleted: () => Promise<BankCredit[]>
}
