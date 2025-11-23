import { User } from "./User";
import { Account } from "./Account";
import { UserNotFoundError } from "../errors/entities/user/UserNotFoundError";
import { AccountNotFoundError } from "../errors/entities/account/AccountNotFoundError";

export class Beneficiary {
  public id?: number;

  public static from({
    id,
    name,
    ownerId,
    owner,
    accountId,
    account,
  }: {
    id?: number,
    name: string,
    ownerId?: number,
    owner?: User,
    accountId?: number,
    account?: Account,
  }): Beneficiary | UserNotFoundError | AccountNotFoundError {
    const maybeOwnerId = ownerId ?? owner?.id;
    if (!maybeOwnerId) {
      return new UserNotFoundError('Beneficiary must have a valid ownerId or owner.');
    }

    const maybeAccountId = accountId ?? account?.id;
    if (!maybeAccountId) {
      return new AccountNotFoundError('Beneficiary must have a valid accountId or account.');
    }

    const beneficiary = new this(
      name,
      maybeOwnerId,
      maybeAccountId,
      owner ?? undefined,
      account ?? undefined,
    );

    if (id) {
      beneficiary.id = id;
    }

    return beneficiary;
  }

  private constructor(
    public name: string,
    public ownerId: number,
    public accountId: number,
    public owner?: User,
    public account?: Account,
  ) {
  }
}
