import { HydratedAccount } from "../../../domain/entities/Account";
import { User } from "../../../domain/entities/User";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { AccountNotFoundError } from "../../../domain/errors/entities/account/AccountNotFoundError";
import { AccountAmountValue } from "../../../domain/values/AccountAmountValue";
import { AccountRepositoryInterface } from "../../repositories/AccountRepositoryInterface";
import { OperationRepositoryInterface } from "../../repositories/OperationRepositoryInterface";

export class GetAccountUsecase {
  public constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly operationRepository: OperationRepositoryInterface
  ) {}

  public async execute(
    id: number,
    owner: User
  ): Promise<HydratedAccount | AccountNotFoundError> {
    const maybeAccount = await this.accountRepository.findById(id);
    if (maybeAccount instanceof AccountNotFoundError) {
      return maybeAccount;
    }
    if (
      maybeAccount.ownerId !== owner.id &&
      !owner.roles.includes(RoleEnum.ADVISOR)
    ) {
      return new AccountNotFoundError("Account not found.");
    }

    const operations = await this.operationRepository.findByAccount(id);
    if (operations instanceof AccountNotFoundError) {
      return { ...maybeAccount, amount: 0 };
    }

    const amountValue = AccountAmountValue.from(id, operations);

    return { ...maybeAccount, amount: amountValue.value };
  }
}
