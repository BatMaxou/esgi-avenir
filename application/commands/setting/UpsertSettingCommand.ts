import { SettingEnum } from '../../../domain/enums/SettingEnum';
import { InvalidUpsertSettingCommandError } from '../../errors/commands/setting/InvalidUpsertSettingCommandError';
import { UpsertSettingPayloadInterface } from '../../services/api/resources/SettingResourceInterface';

interface Body extends Partial<UpsertSettingPayloadInterface> {}

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

