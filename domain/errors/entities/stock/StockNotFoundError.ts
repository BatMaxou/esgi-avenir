export class StockNotFoundError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'StockNotFoundError';
  }
}
