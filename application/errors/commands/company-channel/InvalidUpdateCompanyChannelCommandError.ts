export class InvalidUpdateCompanyChannelCommandError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidUpdateCompanyChannelCommandError';
  }
}

