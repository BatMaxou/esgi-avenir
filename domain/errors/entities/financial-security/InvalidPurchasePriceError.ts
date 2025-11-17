export class InvalidPurchasePriceError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidPurchasePriceError';
  }
}

