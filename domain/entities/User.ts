import { RoleEnum } from "../enums/RoleEnum";
import { InvalidEmailError } from "../errors/values/email/InvalidEmailError";
import { EmailValue } from "../values/EmailValue";

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
  }: {
    id?: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    roles: RoleEnum[],
  }): User | Error {
    const emailValue = EmailValue.from(email);
    if (emailValue instanceof InvalidEmailError) {
      return emailValue;
    }

    const user = new this(firstName, lastName, emailValue, password, roles);
    if (id) {
      user.id = id;
    }

    return user;
  }

  private constructor(
    public firstName: string,
    public lastName: string,
    public email: EmailValue,
    public password: string,
    roles: RoleEnum[] = [],
  ) {
    this.roles = roles;
    if (!this.roles.includes(RoleEnum.USER)) {
      this.roles.push(RoleEnum.USER);
    }
  }
}
