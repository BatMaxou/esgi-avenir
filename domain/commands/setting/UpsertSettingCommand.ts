import { SettingEnum } from '../../enums/SettingEnum';
import { InvalidUpsertSettingCommandError } from '../../errors/commands/setting/InvalidUpsertSettingCommandError';

interface Body {
  code?: string;
  value?: string | number | boolean;
}

export class UpsertSettingCommand {
  public static from(body: Body): UpsertSettingCommand | InvalidUpsertSettingCommandError {
    if (
      !body.code
      || !body.value
    ) {
      return new InvalidUpsertSettingCommandError('Payload is not valid.');
    }

    const code = body.code as SettingEnum;
    if (!Object.values(SettingEnum).includes(code)) {
      return new InvalidUpsertSettingCommandError('Unknown setting.');
    }

    return new UpsertSettingCommand(
      code,
      body.value,
    );
  }

  private constructor(
    public readonly code: SettingEnum,
    public readonly value: string | number | boolean,
  ) {
  }
}

