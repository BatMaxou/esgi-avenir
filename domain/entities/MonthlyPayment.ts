import { BankCredit } from "./BankCredit";
import { InvalidAmountError } from "../errors/entities/monthly-payment/InvalidAmountError";
import { BankCreditNotFoundError } from "../errors/entities/bank-credit/BankCreditNotFoundError";

export class MonthlyPayment {
  public id?: number;

  public static from({
    id,
    amount,
    bankCreditId,
    bankCredit,
  }: {
    id?: number,
    amount: number,
    bankCreditId?: number,
    bankCredit?: BankCredit,
  }): MonthlyPayment | BankCreditNotFoundError | InvalidAmountError {
    const maybeBankCreditId = bankCreditId ?? bankCredit?.id;
    if (!maybeBankCreditId) {
      return new BankCreditNotFoundError('Bank credit not found for monthly payment.');
    }

    if (amount <= 0) {
      return new InvalidAmountError('Amount must be greater than zero for bank credit.');
    }

    const monthlyPayment = new this(
      amount,
      maybeBankCreditId,
      bankCredit ?? undefined,
    );

    if (id) {
      monthlyPayment.id = id;
    }

    return monthlyPayment;
  }

  private constructor(
    public amount: number,
    public bankCreditId: number,
    public bankCredit?: BankCredit,
  ) {
  }
}
