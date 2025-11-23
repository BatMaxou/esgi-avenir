import { User } from "./User";
import { InvalidIbanError } from "../errors/values/iban/InvalidIbanError";
import { IbanValue } from "../values/IbanValue";
import { UserNotFoundError } from "../errors/entities/user/UserNotFoundError";

export interface HydratedAccount extends Account {
  amount: number;
}

export class Account {
  public id?: number;

  public static from({
    id,
    iban,
    name,
    ownerId,
    owner,
    isSavings = false,
  }: {
    id?: number,
    iban: string,
    name: string,
    ownerId?: number,
    owner?: User,
    isSavings?: boolean,
  }): Account | UserNotFoundError | InvalidIbanError {
    const maybeOwnerId = ownerId ?? owner?.id;
    if (!maybeOwnerId) {
      return new UserNotFoundError('Account must have a valid ownerId or owner.');
    }

    const maybeIban = IbanValue.from(iban);
    if (maybeIban instanceof InvalidIbanError) {
      return maybeIban;
    }

    const account = new this(
      maybeIban,
      name,
      maybeOwnerId,
      owner ?? undefined,
      isSavings,
    );

    if (id) {
      account.id = id;
    }

    return account;
  }

  private constructor(
    public iban: IbanValue,
    public name: string,
    public ownerId: number,
    public owner?: User,
    public isSavings: boolean = false,
  ) {
  }
}
