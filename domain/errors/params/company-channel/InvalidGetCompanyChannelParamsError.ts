export class InvalidGetCompanyChannelParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidGetCompanyChannelParamsError';
  }
}

