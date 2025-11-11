import { Account } from '../../../domain/entities/Account';
import { User } from '../../../domain/entities/User';
import { AccountNotFoundError } from '../../../domain/errors/entities/account/AccountNotFoundError';
import { AccountAmountValue } from '../../../domain/values/AccountAmountValue';
import { AccountRepositoryInterface } from '../../repositories/AccountRepositoryInterface';
import { OperationRepositoryInterface } from '../../repositories/OperationRepositoryInterface';

export class GetAccountListUsecase {
  public constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly operationRepository: OperationRepositoryInterface,
  ) {}

  public async execute(
    owner: User,
  ): Promise<(Account & { amount: number })[]> {
    if (!owner.id) {
      return [];
    }

    const accounts = await this.accountRepository.findAllByOwner(owner.id);

    return Promise.all(accounts.map(async (account) => {
      if (!account.id) {
        return { ...account, amount: 0 };
      }

      const operations = await this.operationRepository.findByAccount(account.id);
      if (operations instanceof AccountNotFoundError) {
        return { ...account, amount: 0 };
      }
  
      const amountValue = AccountAmountValue.from(account.id, operations);

      return { ...account, amount: amountValue.value  };
    }));
  }
}

