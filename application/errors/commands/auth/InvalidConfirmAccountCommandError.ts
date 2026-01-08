export class InvalidConfirmAccountCommandError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidConfirmAccountCommandError';
  }
}

