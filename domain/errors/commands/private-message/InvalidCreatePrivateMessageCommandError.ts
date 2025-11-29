export class InvalidCreatePrivateMessageCommandError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidCreatePrivateMessageCommandError';
  }
}

