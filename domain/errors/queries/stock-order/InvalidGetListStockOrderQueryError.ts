export class InvalidGetListStockOrderQueryError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidGetListStockOrderQueryError';
  }
}

