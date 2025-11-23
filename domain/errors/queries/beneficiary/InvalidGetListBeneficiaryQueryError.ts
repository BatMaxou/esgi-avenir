export class InvalidGetListBeneficiaryQueryError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidGetListBeneficiaryQueryError';
  }
}

