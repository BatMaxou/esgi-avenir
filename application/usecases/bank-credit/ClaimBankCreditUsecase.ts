import { Operation } from '../../../domain/entities/Operation';
import { OperationRepositoryInterface } from '../../repositories/OperationRepositoryInterface';
import { AccountNotFoundError } from '../../../domain/errors/entities/account/AccountNotFoundError';
import { OperationEnum } from '../../../domain/enums/OperationEnum';
import { AccountNotEmptyError } from '../../../domain/errors/entities/operation/AccountNotEmptyError';
import { InvalidOperationTypeError } from '../../../domain/errors/entities/operation/InvalidOperationTypeError';
import { BankCreditRepositoryInterface } from '../../repositories/BankCreditRepositoryInterface';
import { BankCreditNotFoundError } from '../../../domain/errors/entities/bank-credit/BankCreditNotFoundError';
import { MonthlyPaymentRepositoryInterface } from '../../repositories/MonthlyPaymentRepositoryInterface';
import { RemainingBankCreditValue } from '../../../domain/values/RemainingBankCreditValue';
import { MonthlyPayment } from '../../../domain/entities/MonthlyPayment';
import { InvalidAmountError } from '../../../domain/errors/entities/monthly-payment/InvalidAmountError';
import { BankCreditStatusEnum } from '../../../domain/enums/BankCreditStatusEnum';

export class ClaimBankCreditUsecase {
  public constructor(
    private readonly operationRepository: OperationRepositoryInterface,
    private readonly bankCreditRepository: BankCreditRepositoryInterface,
    private readonly monthlyPaymentRepository: MonthlyPaymentRepositoryInterface,
  ) {}

  public async execute(): Promise<void> {
    const incompleteBankCredit = await this.bankCreditRepository.findAllNotCompleted();

    incompleteBankCredit.forEach(async (bankCredit) => {
      const id = bankCredit.id;
      if (!id) {
        return;
      }

      const maybePayments = await this.monthlyPaymentRepository.findAllByBankCredit(id);
      if (maybePayments instanceof BankCreditNotFoundError) {
        return; 
      }

      const remaining = RemainingBankCreditValue.from({ id, amount: bankCredit.amount }, maybePayments);
      
      const total = bankCredit.amount + (bankCredit.amount * bankCredit.interestPercentage / 100) + (bankCredit.amount * bankCredit.insurancePercentage / 100);
      const monthy = Math.floor(total / bankCredit.durationInMonths)

      const maybeMonthlyPayment = MonthlyPayment.from({
        amount: monthy > remaining.value ? remaining.value : monthy,
        bankCreditId: id,
      });
      if (
        maybeMonthlyPayment instanceof BankCreditNotFoundError
        || maybeMonthlyPayment instanceof InvalidAmountError
      ) {
        return maybeMonthlyPayment;
      }

      const maybeNewOperation = Operation.from({
        type: OperationEnum.TO_BANK,
        amount: maybeMonthlyPayment.amount,
        fromId: bankCredit.accountId, 
      });
      if (
        maybeNewOperation instanceof AccountNotFoundError
        || maybeNewOperation instanceof AccountNotEmptyError
        || maybeNewOperation instanceof InvalidOperationTypeError
      ) {
        return;
      }

      await Promise.all([
        this.monthlyPaymentRepository.create(maybeMonthlyPayment),
        this.operationRepository.create(maybeNewOperation),
        ...(remaining.value === maybeMonthlyPayment.amount ? [this.bankCreditRepository.update({ id, status: BankCreditStatusEnum.COMPLETED })] : []),
      ]);
    });
  }
}

