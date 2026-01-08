export class InvalidHtmlContentError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidHtmlContentError';
  }
}
