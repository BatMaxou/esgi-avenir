export class InvalidCreateNewsCommandError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidCreateNewsCommandError';
  }
}

