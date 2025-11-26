export class InvalidAmountError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidAmountError';
  }
}
