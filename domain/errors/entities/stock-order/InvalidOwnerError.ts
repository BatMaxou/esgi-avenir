export class InvalidOwnerError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidOwnerError';
  }
}

