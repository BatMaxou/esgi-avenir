export class InvalidWriteCompanyMessageCommandError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidWriteCompanyMessageCommandError';
  }
}

