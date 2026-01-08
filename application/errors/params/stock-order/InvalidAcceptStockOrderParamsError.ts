export class InvalidAcceptStockOrderParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidAcceptStockOrderParamsError';
  }
}

