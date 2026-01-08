export class AccountNotFoundError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'AccountNotFoundError';
  }
}
