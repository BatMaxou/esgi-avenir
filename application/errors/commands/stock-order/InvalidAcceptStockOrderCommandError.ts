export class InvalidAcceptStockOrderCommandError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidAcceptStockOrderCommandError';
  }
}

