export class InvalidTypeError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidTypeError';
  }
}

