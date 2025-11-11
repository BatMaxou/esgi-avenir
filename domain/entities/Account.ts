import { User } from "./User";
import { InvalidOwnerError } from "../errors/entities/account/InvalidOwnerError";
import { InvalidIbanError } from "../errors/values/iban/InvalidIbanError";
import { IbanValue } from "../values/IbanValue";

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
  }: {
    id?: number,
    iban: string,
    name: string,
    ownerId?: number,
    owner?: User,
  }): Account | InvalidOwnerError | InvalidIbanError {
    const maybeOwnerId = ownerId ?? owner?.id;
    if (!maybeOwnerId) {
      return new InvalidOwnerError('Account must have a valid ownerId or owner.');
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
  ) {
  }
}
