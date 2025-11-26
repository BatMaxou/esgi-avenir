export class InvalidUpdateNewsParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidUpdateNewsParamsError';
  }
}

