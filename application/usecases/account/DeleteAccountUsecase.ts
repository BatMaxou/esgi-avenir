import { User } from '../../../domain/entities/User';
import { AccountNotFoundError } from '../../../domain/errors/entities/account/AccountNotFoundError';
import { AccountRepositoryInterface } from '../../repositories/AccountRepositoryInterface';

export class DeleteAccountUsecase {
  public constructor(
    private readonly accountRepository: AccountRepositoryInterface,
  ) {}

  public async execute(
    id: number,
    owner: User,
  ): Promise<boolean | AccountNotFoundError> {
    const maybeAccount = await this.accountRepository.findById(id);
    if (maybeAccount instanceof AccountNotFoundError) {
      return maybeAccount;
    }

    if (maybeAccount.ownerId !== owner.id) {
      return new AccountNotFoundError('Account not found.');
    }

    return await this.accountRepository.delete(id);
  }
}

