export class MonthlyPaymentNotFoundError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'MonthlyPaymentNotFoundError';
  }
}
