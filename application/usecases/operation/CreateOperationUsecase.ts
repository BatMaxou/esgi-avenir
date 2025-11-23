import { Operation } from '../../../domain/entities/Operation';
import { OperationRepositoryInterface } from '../../repositories/OperationRepositoryInterface';
import { AccountNotFoundError } from '../../../domain/errors/entities/account/AccountNotFoundError';
import { OperationEnum } from '../../../domain/enums/OperationEnum';
import { User } from '../../../domain/entities/User';
import { AccountRepositoryInterface } from '../../repositories/AccountRepositoryInterface';
import { AccountAmountValue } from '../../../domain/values/AccountAmountValue';
import { InsufficientFundsError } from '../../../domain/errors/entities/account/InsufficientFundsError';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { AccountNotEmptyError } from '../../../domain/errors/entities/operation/AccountNotEmptyError';
import { InvalidOperationTypeError } from '../../../domain/errors/entities/operation/InvalidOperationTypeError';

export class CreateOperationUsecase {
  public constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly operationRepository: OperationRepositoryInterface,
  ) {}

  public async execute(
    type: OperationEnum,
    amount: number,
    fromId: number,
    toId: number,
    user: User,
  ): Promise<Operation | AccountNotFoundError | InsufficientFundsError | UserNotFoundError | AccountNotEmptyError | InvalidOperationTypeError> {
    const maybeUserAccount = await this.accountRepository.findById(fromId);
    if (maybeUserAccount instanceof AccountNotFoundError) {
      return new AccountNotFoundError('Account not found.');
    }

    if (maybeUserAccount.ownerId !== user.id) {
      return new AccountNotFoundError('Account not found.');
    }

    const maybeUserAccountOperations = await this.operationRepository.findByAccount(fromId);
    if (maybeUserAccountOperations instanceof AccountNotFoundError) {
      return maybeUserAccountOperations 
    }

    const currentAmount = AccountAmountValue.from(fromId, maybeUserAccountOperations);
    if (currentAmount.value < amount) {
      return new InsufficientFundsError('Insufficient funds.');
    }

    const maybeDestinationAccount = await this.accountRepository.findById(toId);
    if (maybeDestinationAccount instanceof AccountNotFoundError) {
      return maybeDestinationAccount;
    }

    const maybeNewOperation = Operation.from({
      type,
      amount,
      fromId,
      toId,
    });
      if (
        maybeNewOperation instanceof UserNotFoundError
        || maybeNewOperation instanceof AccountNotFoundError
        || maybeNewOperation instanceof AccountNotEmptyError
        || maybeNewOperation instanceof InvalidOperationTypeError
      ) {
        return maybeNewOperation;
      }

    return await this.operationRepository.create(maybeNewOperation);
  }
}

