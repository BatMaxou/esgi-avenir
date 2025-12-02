import { SettingNotFoundError } from '../../../domain/errors/entities/setting/SettingNotFoundError';
import { SettingRepositoryInterface } from '../../repositories/SettingRepositoryInterface';
import { Setting } from '../../../domain/entities/Setting';
import { SettingEnum } from '../../../domain/enums/SettingEnum';

export class GetSettingUsecase {
  public constructor(
    private readonly settingRepository: SettingRepositoryInterface,
  ) {}

  public async execute(
    code: SettingEnum,
  ): Promise<Setting | SettingNotFoundError> {
    return await this.settingRepository.findByCode(code);
  }
}

