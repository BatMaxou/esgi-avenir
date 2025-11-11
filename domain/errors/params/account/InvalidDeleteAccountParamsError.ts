export class InvalidDeleteAccountParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidDeleteAccountParamsError';
  }
}

