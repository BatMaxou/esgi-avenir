import { SettingNotFoundError } from '../../../domain/errors/entities/setting/SettingNotFoundError';
import { SettingRepositoryInterface } from '../../repositories/SettingRepositoryInterface';
import { OperationRepositoryInterface } from '../../repositories/OperationRepositoryInterface';
import { Setting } from '../../../domain/entities/Setting';

export class GetSettingListUsecase {
  public constructor(
    private readonly settingRepository: SettingRepositoryInterface,
  ) {}

  public async execute(): Promise<Setting[]> {
    return await this.settingRepository.findAll();
  }
}

