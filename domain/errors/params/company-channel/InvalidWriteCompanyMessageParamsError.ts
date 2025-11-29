export class InvalidWriteCompanyMessageParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidWriteCompanyMessageParamsError';
  }
}

