export class InvalidUpdatePrivateChannelCommandError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidUpdatePrivateChannelCommandError';
  }
}

