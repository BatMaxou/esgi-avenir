export class InvalidDeleteStockOrderParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidDeleteStockOrderParamsError';
  }
}

