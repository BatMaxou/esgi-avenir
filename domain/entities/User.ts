import { RoleEnum } from "../enums/RoleEnum";
import { InvalidEmailError } from "../errors/values/email/InvalidEmailError";
import { InvalidPasswordError } from "../errors/values/password/InvalidPasswordError";
import { EmailValue } from "../values/EmailValue";
import { PasswordValue } from "../values/PasswordValue";
import { HashedPasswordValue } from "../values/HashedPasswordValue";

export class User {
  public id?: number;
  public roles: RoleEnum[];

  public static from({
    id,
    firstName,
    lastName,
    email,
    password,
    roles,
    enabled = false,
    confirmationToken = null,
  }: {
    id?: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string | HashedPasswordValue,
    roles?: RoleEnum[],
    enabled?: boolean,
    confirmationToken?: string | null,
  }): User | InvalidEmailError | InvalidPasswordError {
    const maybeEmail = EmailValue.from(email);
    if (maybeEmail instanceof InvalidEmailError) {
      return maybeEmail;
    };

    const maybePassword = password instanceof HashedPasswordValue
      ? password
      : PasswordValue.from(password);
    if (maybePassword instanceof InvalidPasswordError) {
      return maybePassword;
    };

    const user = new this(
      firstName,
      lastName,
      maybeEmail,
      maybePassword,
      enabled,
      roles || [],
      confirmationToken,
    );

    if (id) {
      user.id = id;
    }

    return user;
  }

  private constructor(
    public firstName: string,
    public lastName: string,
    public email: EmailValue,
    public password: PasswordValue | HashedPasswordValue,
    public enabled: boolean = false,
    roles: RoleEnum[] = [],
    public confirmationToken?: string | null,
  ) {
    this.roles = roles;
    if (!this.roles.includes(RoleEnum.USER)) {
      this.roles.push(RoleEnum.USER);
    }
  }
}
