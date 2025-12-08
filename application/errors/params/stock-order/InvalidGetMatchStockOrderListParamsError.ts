export class InvalidGetMatchStockOrderListParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidGetMatchStockOrderListParamsError';
  }
}

