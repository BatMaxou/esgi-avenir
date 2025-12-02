export class InvalidCreateCompanyChannelCommandError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidCreateCompanyChannelCommandError';
  }
}

