import { MonthlyPaymentRepositoryInterface } from '../repositories/MonthlyPaymentRepositoryInterface';
import { MonthlyPayment } from '../../domain/entities/MonthlyPayment';

type MockMonthlyPayment = {
  amount: number,
  bankCreditId: number,
}

export class MonthlyPaymentFixtures {
  public constructor(
    private readonly repository: MonthlyPaymentRepositoryInterface,
  ) {}

  public async load(): Promise<boolean | Error> {
    const monthlyPayments: MockMonthlyPayment[] = [
      {
        amount: 436,
        bankCreditId: 1,
      },
      {
        amount: 436,
        bankCreditId: 1,
      },
    ];

    for (const monthlyPayment of monthlyPayments) {
      await this.createMonthlyPayment(monthlyPayment);
    }

    return true;
  }

  private async createMonthlyPayment(mockMonthlyPayment: MockMonthlyPayment): Promise<boolean | Error> {
    const maybeMonthlyPayment = MonthlyPayment.from(mockMonthlyPayment);
    if (maybeMonthlyPayment instanceof Error) {
      return maybeMonthlyPayment;
    }

    const maybeError = await this.repository.create(maybeMonthlyPayment);
    if (maybeError instanceof Error) {
      return maybeError;
    }

    return true;
  }
}
