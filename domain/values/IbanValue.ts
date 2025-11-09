import { isValidIBAN } from "ibantools";

import { InvalidIbanError } from "../errors/values/iban/InvalidIbanError";

export class IbanValue {
  // FR00 F -> 15, G -> 27
  private static FR = '152700';

  private static readonly IBAN_ACCOUNT_LETTER_VALUE_MAP: { [key: string]: number } = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
    I: 9,
    J: 1,
    K: 2,
    L: 3,
    M: 4,
    N: 5,
    O: 6,
    P: 7,
    Q: 8,
    R: 9,
    S: 2,
    T: 3,
    U: 4,
    V: 5,
    W: 6,
    X: 7,
    Y: 8,
    Z: 9,
  };

  private static padLeft(value: string, length: number): string {
    return value.length >= length ? value : this.padLeft(`0${value}`, length);
  }

  private static modulo97(value: string): number {
    if (value.length <= 9) {
      return parseInt(value, 10) % 97;
    }

    const firstNine = value.slice(0, 9);
    const rest = value.slice(9);

    const remainder = parseInt(firstNine, 10) % 97;

    return this.modulo97(`${remainder}${rest}`);
  }

  private static transformAccountToNumeric(account: string): string {
    return account.split('').map((char) => {
      if (/[A-Z]/.test(char)) {
        return this.IBAN_ACCOUNT_LETTER_VALUE_MAP[char].toString();
      }

      return char;
    }).join('');
  }

  private static calculateRibKey(bank: string, branch: string, account: string): string {
    const base = 
      parseInt(bank, 10) * 89
      + parseInt(branch, 10) * 15
      + parseInt(account, 10) * 3

    const ribKey = 97 - (base % 97);

    return this.padLeft(`${ribKey}`, 2);
  }

  private static calculateIbanKey(bank: string, branch: string, account: string, ribKey: string): string {
    const concatenated = `${bank}${branch}${account}${ribKey}${this.FR}`;
    const remainder = this.modulo97(concatenated);

    const ibanKey = 98 - remainder;

    return this.padLeft(`${ibanKey}`, 2);
  }

  public static from(value: string): IbanValue | InvalidIbanError {
    if (isValidIBAN(value)) {
      return new InvalidIbanError("Iban is not valid"); 
    }

    return new IbanValue(value);
  }

  public static create(bank: string, branch: string, account: string): IbanValue | InvalidIbanError {
    if (!parseInt(bank) || !parseInt(branch)) {
      return new InvalidIbanError("Bank and Branch codes must be valid numeric string values");
    }

    const bankCode = this.padLeft(bank.replace(/\s+/g, ''), 5);
    const branchCode = this.padLeft(branch.replace(/\s+/g, ''), 5);
    const accountCode = this.transformAccountToNumeric(this.padLeft(account.toUpperCase().replace(/\s+/g, ''), 11));
    const ribKey = this.calculateRibKey(bankCode, branchCode, accountCode);
    const ibanKey = this.calculateIbanKey(bankCode, branchCode, accountCode, ribKey);

    const iban = `FR${ibanKey}${bankCode}${branchCode}${accountCode}${ribKey}`;
    if (!isValidIBAN(iban)) {
      return new InvalidIbanError("Iban is not valid");
    }
    
    return new IbanValue(iban);
  }

  private constructor(public value: string) {}
}
