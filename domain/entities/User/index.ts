import { RoleEnum } from "../../enums/RoleEnum";
import { EmailValue } from "../../values/EmailValue";

export class User {
  public roles: RoleEnum[];

  public static from(email: string): User | Error {
    const emailValue = EmailValue.from(email);
    if (emailValue instanceof Error) {
      return emailValue;
    }

    return new this(emailValue);
  }

  private constructor(
    public email: EmailValue,
    roles: RoleEnum[] = [],
  ) {
    this.roles = roles;
    if (!this.roles.includes(RoleEnum.USER)) {
      this.roles.push(RoleEnum.USER);
    }
  }
}
