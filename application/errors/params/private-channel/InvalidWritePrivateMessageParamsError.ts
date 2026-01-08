export class InvalidWritePrivateMessageParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidWritePrivateMessageParamsError';
  }
}

