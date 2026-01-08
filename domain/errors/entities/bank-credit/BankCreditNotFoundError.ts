export class BankCreditNotFoundError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'BankCreditNotFoundError';
  }
}
