import { User } from '../../../domain/entities/User';
import { AccountRepositoryInterface, UpdateAccountPayload } from '../../repositories/AccountRepositoryInterface';
import { Account } from '../../../domain/entities/Account';
import { AccountNotFoundError } from '../../../domain/errors/entities/account/AccountNotFoundError';

export class UpdateAccountUsecase {
  public constructor(
    private readonly accountRepository: AccountRepositoryInterface,
  ) {}

  public async execute(
    owner: User,
    account: UpdateAccountPayload,
  ): Promise<Account | AccountNotFoundError> {
    const { id } = account;

    const maybeAccount = await this.accountRepository.findById(id);
    if (maybeAccount instanceof AccountNotFoundError) {
      return maybeAccount;
    }

    if (maybeAccount.ownerId !== owner.id) {
      return new AccountNotFoundError('Account not found.');
    }

    return await this.accountRepository.update(account);
  }
}

