import { HydratedOperation } from "../../../domain/entities/Operation";
import { AccountNotFoundError } from "../../../domain/errors/entities/account/AccountNotFoundError";
import { OperationRepositoryInterface } from "../../repositories/OperationRepositoryInterface";
import { AccountRepositoryInterface } from "../../repositories/AccountRepositoryInterface";
import { User } from "../../../domain/entities/User";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { BeneficiaryRepositoryInterface } from "../../repositories/BeneficiaryRepositoryInterface";
import { BeneficiaryNotFoundError } from "../../../domain/errors/entities/beneficiary/BeneficiaryNotFoundError";

export class GetOperationListUsecase {
  public constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly operationRepository: OperationRepositoryInterface,
    private readonly beneficiaryRepository: BeneficiaryRepositoryInterface
  ) {}

  public async execute(
    accountId: number,
    user: User
  ): Promise<HydratedOperation[] | AccountNotFoundError> {
    const userAccount = await this.accountRepository.findById(accountId);
    if (userAccount instanceof AccountNotFoundError) {
      return new AccountNotFoundError("Account not found.");
    }

    if (
      userAccount.ownerId !== user.id &&
      !user.roles.includes(RoleEnum.ADVISOR)
    ) {
      return new AccountNotFoundError("Account not found.");
    }

    const maybeOperations = await this.operationRepository.findByAccount(
      accountId
    );
    if (maybeOperations instanceof AccountNotFoundError) {
      return maybeOperations;
    }

    const operations = await Promise.all(
      maybeOperations.map(async (operation) => {
        if (!operation.id) {
          return {
            ...operation,
            from: null,
            to: null,
            fromBeneficiary: null,
            toBeneficiary: null,
          };
        }

        const maybeFrom = operation.fromId
          ? userAccount.id === operation.fromId
            ? userAccount
            : await this.accountRepository.findById(operation.fromId)
          : null;
        const maybeTo = operation.toId
          ? userAccount.id === operation.toId
            ? userAccount
            : await this.accountRepository.findById(operation.toId)
          : null;
        if (
          maybeFrom instanceof AccountNotFoundError ||
          maybeTo instanceof AccountNotFoundError
        ) {
          return {
            ...operation,
            from: null,
            to: null,
            fromBeneficiary: null,
            toBeneficiary: null,
          };
        }

        const maybeFromBeneficiary =
          maybeFrom && maybeFrom.id
            ? await this.beneficiaryRepository.findByOwnerAndAccount(
                userAccount.ownerId,
                maybeFrom.id
              )
            : null;
        const maybeToBeneficiary =
          maybeTo && maybeTo.id
            ? await this.beneficiaryRepository.findByOwnerAndAccount(
                userAccount.ownerId,
                maybeTo.id
              )
            : null;

        if (
          maybeFromBeneficiary instanceof BeneficiaryNotFoundError ||
          maybeToBeneficiary instanceof BeneficiaryNotFoundError
        ) {
          return {
            ...operation,
            from: null,
            to: null,
            fromBeneficiary: null,
            toBeneficiary: null,
          };
        }

        return {
          ...operation,
          from: maybeFrom ? maybeFrom.iban.value : null,
          to: maybeTo ? maybeTo.iban.value : null,
          fromBeneficiary: maybeFromBeneficiary
            ? {
                id: maybeFromBeneficiary.id,
                name: maybeFromBeneficiary.name,
                accountId: maybeFromBeneficiary.ownerId,
              }
            : null,
          toBeneficiary: maybeToBeneficiary
            ? {
                id: maybeToBeneficiary.id,
                name: maybeToBeneficiary.name,
                accountId: maybeToBeneficiary.ownerId,
              }
            : null,
        };
      })
    );

    return operations.sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }
}
