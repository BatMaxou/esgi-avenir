export class SettingNotFoundError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'SettingNotFoundError';
  }
}

