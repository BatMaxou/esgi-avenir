export class InvalidCreateStockCommandError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidCreateStockCommandError';
  }
}

