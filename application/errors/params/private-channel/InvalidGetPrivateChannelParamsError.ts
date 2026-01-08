export class InvalidGetPrivateChannelParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidGetPrivateChannelParamsError';
  }
}

