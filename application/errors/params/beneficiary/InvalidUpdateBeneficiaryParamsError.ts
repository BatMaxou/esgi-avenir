export class InvalidUpdateBeneficiaryParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidUpdateBeneficiaryParamsError';
  }
}

