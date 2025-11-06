export class InvalidUpdateUserCommandError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidUpdateUserCommandError';
  }
}

