export class InvalidUpdateAccountParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidUpdateAccountParamsError';
  }
}

