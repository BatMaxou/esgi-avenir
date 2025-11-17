export class InvalidBasePriceError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidBasePriceError';
  }
}

