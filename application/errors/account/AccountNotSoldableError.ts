export class AccountNotSoldableError extends Error {
  public constructor(message: string = 'Account is not soldable.') {
    super(message);

    this.name = 'AccountNotSoldable';
  }
}

