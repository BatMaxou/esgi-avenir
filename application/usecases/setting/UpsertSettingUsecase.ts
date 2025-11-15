import { SettingRepositoryInterface } from '../../repositories/SettingRepositoryInterface';
import { Setting } from '../../../domain/entities/Setting';
import { SettingNotFoundError } from '../../../domain/errors/entities/setting/SettingNotFoundError';
import { SettingEnum } from '../../../domain/enums/SettingEnum';

export class UpsertSettingUsecase {
  public constructor(
    private readonly settingRepository: SettingRepositoryInterface,
  ) {}

  public async execute(
    code: SettingEnum,
    value: string | number | boolean,
  ): Promise<Setting | SettingNotFoundError> {
    return await this.settingRepository.upsert({
      code,
      value,
    });
  }
}

