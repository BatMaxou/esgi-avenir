import { BankCreditRepositoryInterface } from '../repositories/BankCreditRepositoryInterface';
import { BankCredit } from '../../domain/entities/BankCredit';

type MockBankCredit = {
  amount: number,
  insurancePercentage: number,
  interestPercentage: number,
  durationInMonths: number,
  advisorId: number,
  accountId: number,
}

export class BankCreditFixtures {
  public constructor(
    private readonly repository: BankCreditRepositoryInterface,
  ) {}

  public async load(): Promise<boolean | Error> {
    const bankCredits: MockBankCredit[] = [
      {
        amount: 10000,
        insurancePercentage: 1,
        interestPercentage: 3.5,
        durationInMonths: 24,
        advisorId: 5,
        accountId: 1,
      },
      {
        amount: 5000,
        insurancePercentage: 0.5,
        interestPercentage: 2.5,
        durationInMonths: 12,
        advisorId: 6,
        accountId: 4,
      },
    ];

    for (const bankCredit of bankCredits) {
      await this.createBankCredit(bankCredit);
    }

    return true;
  }

  private async createBankCredit(mockBankCredit: MockBankCredit): Promise<boolean | Error> {
    const maybeBankCredit = BankCredit.from(mockBankCredit);
    if (maybeBankCredit instanceof Error) {
      return maybeBankCredit;
    }

    const maybeError = await this.repository.create(maybeBankCredit);
    if (maybeError instanceof Error) {
      return maybeError;
    }

    return true;
  }
}
