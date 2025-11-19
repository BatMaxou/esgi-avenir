export class InvalidAccountError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidAccountError';
  }
}

