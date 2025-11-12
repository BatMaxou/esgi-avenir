import { Account } from '../../../domain/entities/Account';
import { User } from '../../../domain/entities/User';
import { AccountRepositoryInterface } from '../../repositories/AccountRepositoryInterface';

export class GetAccountListUsecase {
  public constructor(
    private readonly accountRepository: AccountRepositoryInterface,
  ) {}

  public async execute(
    owner: User,
  ): Promise<Account[]> {
    if (!owner.id) {
      return [];
    }

    return await this.accountRepository.findAllByOwner(owner.id);
  }
}

