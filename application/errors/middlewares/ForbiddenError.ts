export class ForbiddenError extends Error {
  public constructor(message: string = 'Forbidden.') {
    super(message);

    this.name = 'ForbiddenError';
  }
}

