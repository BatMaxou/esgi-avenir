export class InvalidPasswordError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidPasswordError';
  }
}
