export class InvalidLoginCommandError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidLoginCommandError';
  }
}

