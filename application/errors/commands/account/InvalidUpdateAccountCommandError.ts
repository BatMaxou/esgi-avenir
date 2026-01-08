export class InvalidUpdateAccountCommandError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidUpdateAccountCommandError';
  }
}

