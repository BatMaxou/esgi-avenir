export class InvalidDeleteBeneficiaryParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidDeleteBeneficiaryParamsError';
  }
}

