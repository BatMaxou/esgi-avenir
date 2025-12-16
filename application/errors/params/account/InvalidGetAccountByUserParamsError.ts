export class InvalidGetAccountByUserParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = "InvalidGetAccountByUserParamsError";
  }
}
