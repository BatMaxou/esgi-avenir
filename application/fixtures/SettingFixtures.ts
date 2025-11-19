import { Setting } from '../../domain/entities/Setting';
import { SettingEnum } from '../../domain/enums/SettingEnum';
import { SettingRepositoryInterface } from '../repositories/SettingRepositoryInterface';

type MockSetting = {
  code: SettingEnum,
  value: string | number | boolean,
}

export class SettingFixtures {
  public constructor(
    private readonly repository: SettingRepositoryInterface,
  ) {}

  public async load(): Promise<boolean | Error> {
    const settings: MockSetting[] = [
      {
        code: SettingEnum.SAVINGS_RATE,
        value: 1.5,
      },
      {
        code: SettingEnum.SAVINGS_RATE,
        value: 1,
      },
      {
        code: SettingEnum.STOCK_ORDER_PURCHASE_FEE,
        value: 1,
      },
      {
        code: SettingEnum.STOCK_ORDER_SALE_FEE,
        value: 1,
      },
    ];

    for (const setting of settings) {
      await this.createSetting(setting);
    }

    return true;
  }

  private async createSetting(mockSetting: MockSetting): Promise<boolean | Error> {
    const maybeSetting = Setting.from(mockSetting);
    if (maybeSetting instanceof Error) {
      return maybeSetting;
    }

    const maybeError = await this.repository.upsert(maybeSetting);
    if (maybeError instanceof Error) {
      return maybeError;
    }

    return true;
  }
}
