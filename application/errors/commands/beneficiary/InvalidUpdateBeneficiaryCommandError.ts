export class InvalidUpdateBeneficiaryCommandError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidUpdateBeneficiaryCommandError';
  }
}

