export class AccountNotEmptyError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'AccountNotEmptyError';
  }
}

