import { BankCredit } from '../../../domain/entities/BankCredit';
import { BankCreditRepositoryInterface } from '../../repositories/BankCreditRepositoryInterface';
import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { AccountNotFoundError } from '../../../domain/errors/entities/account/AccountNotFoundError';
import { InvalidInsurancePercentageError } from '../../../domain/errors/entities/bank-credit/InvalidInsurancePercentageError';
import { InvalidInterestPercentageError } from '../../../domain/errors/entities/bank-credit/InvalidInterestPercentageError';
import { InvalidDurationInMonthsError } from '../../../domain/errors/entities/bank-credit/InvalidDurationInMonthsError';
import { InvalidAmountError } from '../../../domain/errors/entities/bank-credit/InvalidAmountError';
import { AccountRepositoryInterface } from '../../repositories/AccountRepositoryInterface';
import { BankCreditStatusEnum } from '../../../domain/enums/BankCreditStatusEnum';
import { OperationRepositoryInterface } from '../../repositories/OperationRepositoryInterface';
import { Operation } from '../../../domain/entities/Operation';
import { OperationEnum } from '../../../domain/enums/OperationEnum';
import { AccountNotEmptyError } from '../../../domain/errors/entities/operation/AccountNotEmptyError';
import { InvalidOperationTypeError } from '../../../domain/errors/entities/operation/InvalidOperationTypeError';

export class CreateBankCreditUsecase {
  public constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly bankCreditRepository: BankCreditRepositoryInterface,
    private readonly operationRepository: OperationRepositoryInterface,
  ) {}

  public async execute(
    amount: number,
    insurancePercentage: number,
    interestPercentage: number,
    durationInMonths: number,
    accountId: number,
    ownerId: number,
    advisor: User,
  ): Promise<BankCredit | UserNotFoundError | AccountNotFoundError | InvalidAmountError | InvalidInsurancePercentageError | InvalidInterestPercentageError | InvalidDurationInMonthsError | AccountNotEmptyError | InvalidOperationTypeError> {
    const maybeAccount = await this.accountRepository.findById(accountId);
    if (maybeAccount instanceof AccountNotFoundError) {
      return maybeAccount;
    }

    if (maybeAccount.ownerId !== ownerId) {
      return new AccountNotFoundError('Account not found.');
    }

    const maybeNewBankCredit = BankCredit.from({
      amount,
      insurancePercentage,
      interestPercentage,
      durationInMonths,
      status: BankCreditStatusEnum.APPROVED,
      accountId,
      ownerId,
      advisor,
    });
    if (
      maybeNewBankCredit instanceof UserNotFoundError
      || maybeNewBankCredit instanceof AccountNotFoundError
      || maybeNewBankCredit instanceof InvalidAmountError
      || maybeNewBankCredit instanceof InvalidInsurancePercentageError
      || maybeNewBankCredit instanceof InvalidInterestPercentageError
      || maybeNewBankCredit instanceof InvalidDurationInMonthsError
    ) {
      return maybeNewBankCredit;
    }

    const maybeOperation = Operation.from({
      type: OperationEnum.FROM_BANK,
      name: OperationEnum.FROM_BANK,
      toId: accountId,
      amount,
    });

    if (
      maybeOperation instanceof AccountNotFoundError
      || maybeOperation instanceof AccountNotEmptyError
      || maybeOperation instanceof InvalidOperationTypeError
    ) {
      return maybeOperation;
    }

    const maybeCreatedBankCredit = await this.bankCreditRepository.create(maybeNewBankCredit);
    if ( maybeCreatedBankCredit instanceof Error) {
      return maybeCreatedBankCredit;
    }

    const maybeCreatedOperation = await this.operationRepository.create(maybeOperation);
    if (maybeCreatedOperation instanceof AccountNotFoundError) {
      return maybeCreatedOperation;
    }

    return maybeCreatedBankCredit;
  }
}

