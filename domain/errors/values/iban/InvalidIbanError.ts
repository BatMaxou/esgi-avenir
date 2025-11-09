export class InvalidIbanError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidIbanError';
  }
}

