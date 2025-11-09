import { isValidIBAN } from "ibantools";

import { InvalidIbanError } from "../errors/values/iban/InvalidIbanError";

export class IbanValue {
  public static from(value: string): IbanValue | InvalidIbanError {
    if (isValidIBAN(value)) {
      return new InvalidIbanError("Iban is not valid"); 
    }

    return new IbanValue(value);
  }

  private constructor(public value: string) {}
}
