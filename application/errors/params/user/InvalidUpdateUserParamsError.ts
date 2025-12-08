export class InvalidUpdateUserParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidUpdateUserParamsError';
  }
}

