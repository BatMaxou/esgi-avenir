export class InvalidInsurancePercentageError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidInsurancePercentageError';
  }
}
