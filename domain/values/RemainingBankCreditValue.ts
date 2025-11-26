import { MonthlyPayment } from "../entities/MonthlyPayment";
import { BankCredit } from "../entities/BankCredit";

type MandatoryParameters = Pick<BankCredit, 'id' | 'amount'>;

export class RemainingBankCreditValue {
  public static from(bankCredit: MandatoryParameters, monthlyPayments: MonthlyPayment[]): RemainingBankCreditValue {
    const remaining = monthlyPayments.reduce((acc, payment) => {
      if (payment.bankCreditId !== bankCredit.id) {
        return acc;
      }

      return acc - payment.amount;
    }, bankCredit.amount);

    return new RemainingBankCreditValue(remaining);
  }

  private constructor(public value: number) {}
}
