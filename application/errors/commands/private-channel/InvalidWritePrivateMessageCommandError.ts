export class InvalidWritePrivateMessageCommandError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidWritePrivateMessageCommandError';
  }
}

