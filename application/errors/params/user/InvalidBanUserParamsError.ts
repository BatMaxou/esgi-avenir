export class InvalidBanUserParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidBanUserParamsError';
  }
}

