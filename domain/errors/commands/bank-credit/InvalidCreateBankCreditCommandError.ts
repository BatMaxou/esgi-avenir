export class InvalidCreateBankCreditCommandError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidCreateBankCreditCommandError';
  }
}

