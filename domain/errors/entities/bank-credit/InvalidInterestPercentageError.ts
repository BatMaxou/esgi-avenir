export class InvalidInterestPercentageError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidInterestPercentageError';
  }
}
