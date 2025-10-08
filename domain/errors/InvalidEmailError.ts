export class InvalidEmailError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidEmailError';
  }
}
