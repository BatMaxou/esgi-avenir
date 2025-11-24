import { BankCredit } from "../../domain/entities/BankCredit"
import { AccountNotFoundError } from "../../domain/errors/entities/account/AccountNotFoundError"
import { InvalidAmountError } from "../../domain/errors/entities/bank-credit/InvalidAmountError"
import { InvalidDurationInMonthsError } from "../../domain/errors/entities/bank-credit/InvalidDurationInMonthsError"
import { InvalidInsurancePercentageError } from "../../domain/errors/entities/bank-credit/InvalidInsurancePercentageError"
import { InvalidInterestPercentageError } from "../../domain/errors/entities/bank-credit/InvalidInterestPercentageError"
import { UserNotFoundError } from "../../domain/errors/entities/user/UserNotFoundError"
import { RepositoryInterface } from "./RepositoryInterface"

export interface BankCreditRepositoryInterface extends RepositoryInterface {
  create: (bankCredit: BankCredit) => Promise<BankCredit | UserNotFoundError | AccountNotFoundError | InvalidAmountError | InvalidInterestPercentageError | InvalidInsurancePercentageError | InvalidDurationInMonthsError>;
}
