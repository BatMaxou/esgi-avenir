export class InvalidGetNewsListQueryError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidGetNewsListQueryError';
  }
}

