export class InvalidPurchaseBaseStockCommandError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidPurchaseBaseStockCommandError';
  }
}

