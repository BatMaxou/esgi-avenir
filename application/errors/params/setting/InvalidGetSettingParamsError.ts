export class InvalidGetSettingParamsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidGetSettingParamsError';
  }
}

