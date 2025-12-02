import { MonthlyPayment } from '../../../domain/entities/MonthlyPayment';
import { User } from '../../../domain/entities/User';
import { BankCreditNotFoundError } from '../../../domain/errors/entities/bank-credit/BankCreditNotFoundError';
import { BankCreditRepositoryInterface } from '../../repositories/BankCreditRepositoryInterface';
import { MonthlyPaymentRepositoryInterface } from '../../repositories/MonthlyPaymentRepositoryInterface';

export class GetMonthlyPaymentListUsecase {
  public constructor(
    private readonly bankCreditRepository: BankCreditRepositoryInterface,
    private readonly monthlyPaymentRepository: MonthlyPaymentRepositoryInterface,
  ) {}

  public async execute(
    bankCreditId: number,
    user: User,
  ): Promise<MonthlyPayment[] | BankCreditNotFoundError> {
    if (!user.id) {
      return [];
    }

    const maybeBankCredit = await this.bankCreditRepository.findById(bankCreditId);
    if (maybeBankCredit instanceof BankCreditNotFoundError) {
      return maybeBankCredit;
    }

    if (!user.isAdvisor() && maybeBankCredit.ownerId !== user.id) {
      return new BankCreditNotFoundError('Bank credit not found.');
    }

    if (user.isAdvisor() && maybeBankCredit.advisorId !== user.id) {
      return new BankCreditNotFoundError('Bank credit not found.');
    }

    const payments = await this.monthlyPaymentRepository.findAllByBankCredit(bankCreditId);

    return payments.sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }
}

