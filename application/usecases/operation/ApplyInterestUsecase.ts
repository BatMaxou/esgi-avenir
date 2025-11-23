import { Operation } from '../../../domain/entities/Operation';
import { OperationRepositoryInterface } from '../../repositories/OperationRepositoryInterface';
import { AccountNotFoundError } from '../../../domain/errors/entities/account/AccountNotFoundError';
import { OperationEnum } from '../../../domain/enums/OperationEnum';
import { AccountRepositoryInterface } from '../../repositories/AccountRepositoryInterface';
import { AccountAmountValue } from '../../../domain/values/AccountAmountValue';
import { SettingRepositoryInterface } from '../../repositories/SettingRepositoryInterface';
import { SettingEnum } from '../../../domain/enums/SettingEnum';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { AccountNotEmptyError } from '../../../domain/errors/entities/operation/AccountNotEmptyError';
import { InvalidOperationTypeError } from '../../../domain/errors/entities/operation/InvalidOperationTypeError';

export class ApplyInterestUsecase {
  public constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly operationRepository: OperationRepositoryInterface,
    private readonly settingRepository: SettingRepositoryInterface,
  ) {}

  public async execute(): Promise<void> {
    const accounts = await this.accountRepository.findAllSavingsAccounts();

    accounts.forEach(async (account) => {
      const id = account.id;
      if (!id) {
        return;
      }

      const maybeOperations = await this.operationRepository.findByAccount(id);
      if (maybeOperations instanceof AccountNotFoundError) {
        return; 
      }

      const currentAmount = AccountAmountValue.from(id, maybeOperations);
      const maybeInterestRate = await this.settingRepository.findByCode(SettingEnum.SAVINGS_RATE);
      if (maybeInterestRate instanceof Error) {
        return;
      }

      const interest = currentAmount.value * parseFloat(`${maybeInterestRate.value}`) / 100;
      if (interest <= 0) {
        return;
      }

      const maybeNewOperation = Operation.from({
        type: OperationEnum.INTEREST,
        amount: interest,
        toId: id, 
      });
      if (
        maybeNewOperation instanceof UserNotFoundError
        || maybeNewOperation instanceof AccountNotFoundError
        || maybeNewOperation instanceof AccountNotEmptyError
        || maybeNewOperation instanceof InvalidOperationTypeError
      ) {
        return;
      }

      await this.operationRepository.create(maybeNewOperation);
    });
  }
}

