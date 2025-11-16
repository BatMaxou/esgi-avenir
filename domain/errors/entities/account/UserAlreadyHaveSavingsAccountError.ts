export class UserAlreadyHaveSavingsAccountError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'UserAlreadyHaveSavingsAccountError';
  }
}
