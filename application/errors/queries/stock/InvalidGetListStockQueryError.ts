export class InvalidGetListStockQueryError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidGetListStockQueryError';
  }
}

