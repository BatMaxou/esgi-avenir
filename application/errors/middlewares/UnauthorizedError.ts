export class UnauthorizedError extends Error {
  public constructor(message: string = 'Unauthorized.') {
    super(message);

    this.name = 'UnauthorizedError';
  }
}

