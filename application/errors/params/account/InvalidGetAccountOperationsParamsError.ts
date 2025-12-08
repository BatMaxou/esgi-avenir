export class InvalidGetAccountOperationsParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidGetAccountOperationsParamsError';
  }
}

