import { User } from '../../../domain/entities/User';
import { AccountNotFoundError } from '../../../domain/errors/entities/account/AccountNotFoundError';
import { AccountRepositoryInterface } from '../../repositories/AccountRepositoryInterface';
import { OperationRepositoryInterface } from '../../repositories/OperationRepositoryInterface';
import { AccountNotSoldableError } from '../../../application/errors/account/AccountNotSoldableError';
import { AccountAmountValue } from '../../../domain/values/AccountAmountValue';
import { BeneficiaryRepositoryInterface } from '../../repositories/BeneficiaryRepositoryInterface';

export class DeleteAccountUsecase {
  public constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly beneficiaryRepository: BeneficiaryRepositoryInterface,
    private readonly operationRepository: OperationRepositoryInterface,
  ) {}

  public async execute(
    id: number,
    owner: User,
  ): Promise<boolean | AccountNotFoundError | AccountNotSoldableError> {
    const maybeAccount = await this.accountRepository.findById(id);
    if (maybeAccount instanceof AccountNotFoundError) {
      return maybeAccount;
    }

    if (maybeAccount.ownerId !== owner.id) {
      return new AccountNotFoundError('Account not found.');
    }

    const operations = await this.operationRepository.findByAccount(id);
    if (operations instanceof AccountNotFoundError) {
      return operations;
    }

    const amountValue = AccountAmountValue.from(id, operations);
    if (amountValue.value !== 0) {
      return new AccountNotSoldableError();
    }

    await this.beneficiaryRepository.deleteByAccount(id);

    return await this.accountRepository.delete(id);
  }
}

