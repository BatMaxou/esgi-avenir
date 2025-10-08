import { InvalidEmailError } from "../errors/InvalidEmailError";

export class EmailValue {
  public static from(value: string): EmailValue | InvalidEmailError {
    if (value.match(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm) === null) {
      return new InvalidEmailError("Email is not valid"); 
    }

    return new EmailValue(value);
  }

  private constructor(public value: string) {}
}
