export class InvalidAttributePrivateChannelToParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidAttributePrivateChannelToParamsError';
  }
}

