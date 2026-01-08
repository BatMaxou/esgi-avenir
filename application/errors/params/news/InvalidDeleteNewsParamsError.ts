export class InvalidDeleteNewsParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidDeleteNewsParamsError';
  }
}

