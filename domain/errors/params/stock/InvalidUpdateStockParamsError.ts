export class InvalidUpdateStockParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidUpdateStockParamsError';
  }
}

