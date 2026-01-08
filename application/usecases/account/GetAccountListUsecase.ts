import { HydratedAccount } from '../../../domain/entities/Account';
import { User } from '../../../domain/entities/User';
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
  ): Promise<HydratedAccount[]> {
    if (!owner.id) {
      return [];
    }

    const accounts = await this.accountRepository.findAllByOwner(owner.id);

    return Promise.all(accounts.map(async (account) => {
      const id = account.id;
      if (!id) {
        return { ...account, amount: 0 };
      }

      const operations = await this.operationRepository.findByAccount(id);
      const amountValue = AccountAmountValue.from(id, operations);

      return { ...account, amount: amountValue.value  };
    }));
  }
}

