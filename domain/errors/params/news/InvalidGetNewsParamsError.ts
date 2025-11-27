export class InvalidGetNewsParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidGetNewsParamsError';
  }
}

