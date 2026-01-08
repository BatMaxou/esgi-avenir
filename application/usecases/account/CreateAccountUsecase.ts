import { Account } from '../../../domain/entities/Account';
import { AccountRepositoryInterface } from '../../repositories/AccountRepositoryInterface';
import { InvalidIbanError } from '../../../domain/errors/values/iban/InvalidIbanError';
import { IbanValue } from '../../../domain/values/IbanValue';
import { User } from '../../../domain/entities/User';
import { IbanExistsError } from '../../../domain/errors/entities/account/IbanExistsError';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';

export class CreateAccountUsecase {
  public constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly bankCode: string,
    private readonly branchCode: string,
  ) {}

  public async execute(
    name: string,
    user: User,
    isSavings: boolean = false,
  ): Promise<Account | InvalidIbanError | UserNotFoundError | IbanExistsError> {
    const nextAccountId = await this.accountRepository.findNextId();

    const maybeIban = IbanValue.create(
      this.bankCode,
      this.branchCode,
      `${nextAccountId}`,
    );
    
    if (maybeIban instanceof InvalidIbanError) {
      return maybeIban;
    }

    const maybeNewAccount = Account.from({
      name,
      iban: maybeIban.value,
      owner: user,
      isSavings,
    });
    if (
      maybeNewAccount instanceof InvalidIbanError
      || maybeNewAccount instanceof UserNotFoundError
    ) {
      return maybeNewAccount;
    }

    return await this.accountRepository.create(maybeNewAccount);
  }
}

