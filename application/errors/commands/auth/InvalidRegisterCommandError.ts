export class InvalidRegisterCommandError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidLoginCommandError';
  }
}

