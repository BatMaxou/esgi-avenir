import { RoleEnum } from "../enums/RoleEnum";
import { InvalidEmailError } from "../errors/values/email/InvalidEmailError";
import { InvalidPasswordError } from "../errors/values/password/InvalidPasswordError";
import { EmailValue } from "../values/EmailValue";
import { PasswordValue } from "../values/PasswordValue";
import { HashedPasswordValue } from "../values/HashedPasswordValue";
import { InvalidRolesError } from "../errors/entities/user/InvalidRolesError";

export type WritingMessageUser = Pick<User, 'id' | 'firstName' | 'lastName'>;

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
    isDeleted = false,
  }: {
    id?: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string | HashedPasswordValue,
    roles?: RoleEnum[] | string,
    enabled?: boolean,
    confirmationToken?: string | null,
    isDeleted?: boolean,
  }): User | InvalidEmailError | InvalidPasswordError | InvalidRolesError {
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

    const maybeRoles = typeof roles === 'string'
      ? JSON.parse(roles)
      : roles || [];
    if (!Array.isArray(maybeRoles)) {
      return new InvalidRolesError('Roles must be an array.');
    }

    const user = new this(
      firstName,
      lastName,
      maybeEmail,
      maybePassword,
      enabled,
      maybeRoles,
      confirmationToken,
      isDeleted,
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
    public isDeleted: boolean = false,
  ) {
    this.roles = roles;
    if (!this.roles.includes(RoleEnum.USER)) {
      this.roles.push(RoleEnum.USER);
    }
  }

  public isDirector(): boolean {
    return this.roles.includes(RoleEnum.DIRECTOR);
  }

  public isAdvisor(): boolean {
    return this.roles.includes(RoleEnum.ADVISOR);
  }

  public isBanned(): boolean {
    return this.roles.includes(RoleEnum.BANNED);
  }
}
