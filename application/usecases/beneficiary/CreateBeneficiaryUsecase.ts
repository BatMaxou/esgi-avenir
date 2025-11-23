import { Beneficiary } from '../../../domain/entities/Beneficiary';
import { BeneficiaryRepositoryInterface } from '../../repositories/BeneficiaryRepositoryInterface';
import { InvalidIbanError } from '../../../domain/errors/values/iban/InvalidIbanError';
import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { AccountNotFoundError } from '../../../domain/errors/entities/account/AccountNotFoundError';
import { AccountRepositoryInterface } from '../../repositories/AccountRepositoryInterface';
import { IbanValue } from '../../../domain/values/IbanValue';

export class CreateBeneficiaryUsecase {
  public constructor(
    private readonly beneficiaryRepository: BeneficiaryRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
  ) {}

  public async execute(
    iban: IbanValue,
    owner: User,
    name?: string,
  ): Promise<Beneficiary | InvalidIbanError | UserNotFoundError | AccountNotFoundError> {
    const maybeAccount = await this.accountRepository.findByIban(iban);
    if (maybeAccount instanceof AccountNotFoundError || !maybeAccount.id) {
      return new AccountNotFoundError('Account not found.');
    }

    const maybeNewBeneficiary = Beneficiary.from({
      name: name || `${maybeAccount.owner ? `${maybeAccount.owner.lastName} ${maybeAccount.owner.firstName}` : maybeAccount.iban.value}`,
      accountId: maybeAccount.id,
      owner,
    });
    if (
      maybeNewBeneficiary instanceof AccountNotFoundError
      || maybeNewBeneficiary instanceof UserNotFoundError
    ) {
      return maybeNewBeneficiary;
    }

    return await this.beneficiaryRepository.create(maybeNewBeneficiary);
  }
}

