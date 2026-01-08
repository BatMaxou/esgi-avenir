export class InvalidGetUserParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidGetUserParamsError';
  }
}

