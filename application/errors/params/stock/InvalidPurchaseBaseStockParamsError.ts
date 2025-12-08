export class InvalidPurchaseBaseStockParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidPurchaseBaseStockParamsError';
  }
}

