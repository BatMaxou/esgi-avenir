export class InvalidGetAccountParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidGetAccountParamsError';
  }
}

