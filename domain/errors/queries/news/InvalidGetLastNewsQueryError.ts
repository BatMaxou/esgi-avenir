export class InvalidGetLastNewsQueryError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidGetLastNewsQueryError';
  }
}

