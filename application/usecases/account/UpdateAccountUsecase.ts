import { User } from '../../../domain/entities/User';
import { AccountRepositoryInterface } from '../../repositories/AccountRepositoryInterface';
import { Account } from '../../../domain/entities/Account';
import { AccountNotFoundError } from '../../../domain/errors/entities/account/AccountNotFoundError';

export class UpdateAccountUsecase {
  public constructor(
    private readonly accountRepository: AccountRepositoryInterface,
  ) {}

  public async execute(
    id: number,
    owner: User,
    toUpdate: Omit<Partial<Account>, 'iban' | 'isSavings'>,
  ): Promise<Account | AccountNotFoundError> {
    const maybeAccount = await this.accountRepository.findById(id);
    if (maybeAccount instanceof AccountNotFoundError) {
      return maybeAccount;
    }

    if (maybeAccount.ownerId !== owner.id) {
      return new AccountNotFoundError('Account not found.');
    }

    return await this.accountRepository.update({
      id,
      ...toUpdate,
    });
  }
}

