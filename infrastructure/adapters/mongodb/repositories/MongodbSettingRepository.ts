import { Setting } from "../../../../domain/entities/Setting";
import { SettingNotFoundError } from "../../../../domain/errors/entities/setting/SettingNotFoundError";
import { SettingEnum } from "../../../../domain/enums/SettingEnum";
import { SettingRepositoryInterface } from "../../../../application/repositories/SettingRepositoryInterface";
import { SettingModel } from "../models/SettingModel";
import { getNextSequence } from "../models/CounterModel";
import { AbstractMongoRepository } from "./AbstractMongoRepository";

export class MongodbSettingRepository extends AbstractMongoRepository implements SettingRepositoryInterface {
  public async upsert(
    setting: Setting
  ): Promise<Setting | SettingNotFoundError> {
    try {
      await this.ensureConnection();

      const maybeFoundSetting = await this.findByCode(setting.code);

      if (maybeFoundSetting instanceof Setting) {
        await SettingModel.findOneAndUpdate(
          { code: setting.code },
          { value: setting.value },
          { new: true }
        );
      } else {
        const nextId = await getNextSequence("setting_id");

        await SettingModel.create({
          id: nextId,
          code: setting.code,
          value: setting.value,
        });
      }

      return await this.findByCode(setting.code);
    } catch (error) {
      return new SettingNotFoundError("Setting not found.");
    }
  }

  public async findByCode(
    code: SettingEnum
  ): Promise<Setting | SettingNotFoundError> {
    try {
      await this.ensureConnection();

      const foundSetting = await SettingModel.findOne({ code });

      if (!foundSetting) {
        return new SettingNotFoundError("Setting not found.");
      }

      const maybeSetting = Setting.from({
        id: foundSetting.id,
        code: foundSetting.code,
        value: foundSetting.value,
      });

      if (maybeSetting instanceof Error) {
        throw maybeSetting;
      }

      return maybeSetting;
    } catch (error) {
      return new SettingNotFoundError("Setting not found");
    }
  }

  public async findAll(): Promise<Setting[]> {
    try {
      await this.ensureConnection();

      const foundSettings = await SettingModel.find();
      const settings: Setting[] = [];

      foundSettings.forEach((foundSetting) => {
        const maybeSetting = Setting.from({
          id: foundSetting.id,
          code: foundSetting.code,
          value: foundSetting.value,
        });

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
