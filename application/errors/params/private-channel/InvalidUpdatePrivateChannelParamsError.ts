export class InvalidUpdatePrivateChannelParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidUpdatePrivateChannelParamsError';
  }
}

