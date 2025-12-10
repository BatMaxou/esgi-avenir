import { Setting } from "../../../../domain/entities/Setting";
import { SettingNotFoundError } from "../../../../domain/errors/entities/setting/SettingNotFoundError";
import { MariadbConnection } from "../config/MariadbConnection";
import { SettingModel } from "../models/SettingModel";
import { SettingEnum } from "../../../../domain/enums/SettingEnum";
import { SettingRepositoryInterface } from "../../../../application/repositories/SettingRepositoryInterface";

export class MariadbSettingRepository implements SettingRepositoryInterface {
  private settingModel: SettingModel;

  public constructor(databaseDsn: string) {
    this.settingModel = new SettingModel(new MariadbConnection(databaseDsn).getConnection());
  }

  public async upsert(setting: Setting): Promise<Setting | SettingNotFoundError> {
    try {
      const maybeFoundSetting = await this.findByCode(setting.code);
      if (maybeFoundSetting instanceof Setting) {
        await this.settingModel.model.update({
          value: setting.value,
        }, {
          where: { code: setting.code },
        });
      } else {
        await this.settingModel.model.create({
          code: setting.code,
          value: setting.value,
        });
      }

      return await this.findByCode(setting.code);
    } catch (error) {
      return new SettingNotFoundError('Setting not found.');
    }
  }

  public async findByCode(code: SettingEnum): Promise<Setting | SettingNotFoundError> {
    try {
      const foundSetting = await this.settingModel.model.findOne({ where: { code } });
      if (!foundSetting) {
        return new SettingNotFoundError('Setting not found.');
      }

      const maybeSetting = Setting.from(foundSetting);
      if (maybeSetting instanceof Error) {
        throw maybeSetting;
      }

      return maybeSetting;
    } catch (error) {
      return new SettingNotFoundError('Setting not found');
    }
  }

  public async findAll(): Promise<Setting[]> {
    try {
      const foundSettings = await this.settingModel.model.findAll();
      const settings: Setting[] = [];

      foundSettings.forEach((foundSetting) => {
        const maybeSetting = Setting.from(foundSetting);
        if (maybeSetting instanceof Error) {
          throw maybeSetting;
        }

        settings.push(maybeSetting);
      });

      return settings;
    } catch (error) {
      return [];
    }
  }
}
