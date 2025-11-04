import { InvalidPasswordError } from "../errors/values/password/InvalidPasswordError";

export class PasswordValue {
  public static from(value: string): PasswordValue | InvalidPasswordError {
    if (value.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$/) === null) {
      return new InvalidPasswordError(
        "Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
    }

    return new PasswordValue(value);
  }

  private constructor(public value: string) {}
}
