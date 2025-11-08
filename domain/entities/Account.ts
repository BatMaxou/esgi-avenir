import { RoleEnum } from "../enums/RoleEnum";
import { InvalidEmailError } from "../errors/values/email/InvalidEmailError";
import { InvalidPasswordError } from "../errors/values/password/InvalidPasswordError";
import { EmailValue } from "../values/EmailValue";
import { PasswordValue } from "../values/PasswordValue";
import { HashedPasswordValue } from "../values/HashedPasswordValue";
import { InvalidRolesError } from "../errors/entities/user/InvalidRolesError";
import { User } from "./User";

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
  }): Account {
    const maybeOwnerId = ownerId ?? owner?.id;
    if (!maybeOwnerId) {
      // TODO create et retrun custom error
      throw new Error('Owner ID is required to create an Account.');
    }

    const account = new this(
      iban,
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
    public iban: string,
    public name: string,
    public ownerId: number,
    public owner?: User,
  ) {
  }
}
