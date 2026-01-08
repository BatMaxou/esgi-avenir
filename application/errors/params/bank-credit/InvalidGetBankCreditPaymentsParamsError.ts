export class InvalidGetBankCreditPaymentsParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidGetBankCreditPaymentsParamsError';
  }
}

