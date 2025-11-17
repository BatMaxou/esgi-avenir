export class InvalidStockError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidStockError';
  }
}

