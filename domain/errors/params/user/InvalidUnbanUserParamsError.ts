export class InvalidUnbanUserParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidUnbanUserParamsError';
  }
}

