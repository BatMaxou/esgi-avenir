export class EmailExistsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'EmailExistsError';
  }
}
