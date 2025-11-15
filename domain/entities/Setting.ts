import { SettingEnum } from "../enums/SettingEnum";

export class Setting {
  public id?: number;

  public static from({
    id,
    code,
    value,
  }: {
    id?: number,
    code: SettingEnum,
    value: string | number | boolean,
  }): Setting {
    const setting = new this(
      code,
      value,
    );

    if (id) {
      setting.id = id;
    }

    return setting;
  }

  private constructor(
    public code: SettingEnum,
    public value: string | number | boolean,
  ) {
  }
}
