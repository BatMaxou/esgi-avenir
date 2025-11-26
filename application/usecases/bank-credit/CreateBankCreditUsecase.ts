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

export class CreateBankCreditUsecase {
  public constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly bankCreditRepository: BankCreditRepositoryInterface,
  ) {}

  public async execute(
    amount: number,
    insurancePercentage: number,
    interestPercentage: number,
    durationInMonths: number,
    accountId: number,
    ownerId: number,
    advisor: User,
  ): Promise<BankCredit | UserNotFoundError | AccountNotFoundError | InvalidAmountError | InvalidInsurancePercentageError | InvalidInterestPercentageError | InvalidDurationInMonthsError> {
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

    return await this.bankCreditRepository.create(maybeNewBankCredit);
  }
}

