export class IbanExistsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'IbanExistsError';
  }
}
