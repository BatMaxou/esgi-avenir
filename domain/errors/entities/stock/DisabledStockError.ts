export class DisabledStockError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'DisabledStockError';
  }
}

