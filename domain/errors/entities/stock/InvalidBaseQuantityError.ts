export class InvalidBaseQuantityError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidBaseQuantityError';
  }
}

