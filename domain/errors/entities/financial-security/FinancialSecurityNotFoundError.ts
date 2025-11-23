export class FinancialSecurityNotFoundError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'FinancialSecurityNotFoundError';
  }
}
