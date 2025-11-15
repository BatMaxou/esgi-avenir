export class InvalidUpsertSettingCommandError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidUpsertSettingCommandError';
  }
}

