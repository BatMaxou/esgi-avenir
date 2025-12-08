export class InvalidUpdateCompanyChannelParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidUpdateCompanyChannelParamsError';
  }
}

