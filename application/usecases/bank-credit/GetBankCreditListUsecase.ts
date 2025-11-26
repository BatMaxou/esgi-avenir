import { HydratedBankCredit } from '../../../domain/entities/BankCredit';
import { User } from '../../../domain/entities/User';
import { RemainingBankCreditValue } from '../../../domain/values/RemainingBankCreditValue';
import { BankCreditRepositoryInterface } from '../../repositories/BankCreditRepositoryInterface';
import { MonthlyPaymentRepositoryInterface } from '../../repositories/MonthlyPaymentRepositoryInterface';

export class GetBankCreditListUsecase {
  public constructor(
    private readonly bankCreditRepository: BankCreditRepositoryInterface,
    private readonly monthlyPaymentRepository: MonthlyPaymentRepositoryInterface,
  ) {}

  public async execute(
    user: User,
  ): Promise<HydratedBankCredit[]> {
    if (!user.id) {
      return [];
    }

    const bankCredits = user.isAdvisor()
      ? await this.bankCreditRepository.findAllByAdvisor(user.id)
      : await this.bankCreditRepository.findAllByOwner(user.id)
    ;

    return Promise.all(bankCredits.map(async (bankCredit) => {
      const id = bankCredit.id;
      if (!id) {
        return { ...bankCredit, remains: bankCredit.amount  };
      }

      const monthlyPayments = await this.monthlyPaymentRepository.findAllByBankCredit(id);
      const remainingValue = RemainingBankCreditValue.from({ id, amount: bankCredit.amount }, monthlyPayments);

      return { ...bankCredit, remains: remainingValue.value  };
    }));
  }
}

