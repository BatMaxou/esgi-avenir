export class InvalidGetAccountListByUserQueryError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidGetAccountListByUserQueryError';
  }
}

