export class InvalidOperationTypeError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidOperationTypeError';
  }
}

