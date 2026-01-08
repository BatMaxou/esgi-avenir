export class InvalidStatusError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidStatusError';
  }
}

