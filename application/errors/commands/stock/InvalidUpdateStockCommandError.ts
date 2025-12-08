export class InvalidUpdateStockCommandError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidUpdateStockCommandError';
  }
}

