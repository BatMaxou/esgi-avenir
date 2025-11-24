import { MonthlyPayment } from "../../domain/entities/MonthlyPayment"
import { AccountNotFoundError } from "../../domain/errors/entities/account/AccountNotFoundError"
import { InvalidAmountError } from "../../domain/errors/entities/monthly-payment/InvalidAmountError"
import { UserNotFoundError } from "../../domain/errors/entities/user/UserNotFoundError"
import { RepositoryInterface } from "./RepositoryInterface"

export interface MonthlyPaymentRepositoryInterface extends RepositoryInterface {
  create: (monthlyPayment: MonthlyPayment) => Promise<MonthlyPayment | UserNotFoundError | AccountNotFoundError | InvalidAmountError>;
}
