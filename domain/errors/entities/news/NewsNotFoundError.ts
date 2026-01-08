export class NewsNotFoundError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'NewsNotFoundError';
  }
}
