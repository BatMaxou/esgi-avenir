export class BeneficiaryNotFoundError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'BeneficiaryNotFoundError';
  }
}
