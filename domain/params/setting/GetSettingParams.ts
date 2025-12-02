import { SettingEnum } from "../../enums/SettingEnum";
import { InvalidGetSettingParamsError } from "../../errors/params/setting/InvalidGetSettingParamsError";

interface Params {
  code?: string;
}

export class GetSettingParams {
  public static from(params: Params): GetSettingParams | InvalidGetSettingParamsError {
    if (
      !params.code
      || typeof params.code !== 'string'
    ) {
      return new InvalidGetSettingParamsError('Params not valid.');
    }

    const code = params.code as SettingEnum;
    const validSettings = Object.values(SettingEnum);
    if (!validSettings.includes(code)) {
      return new InvalidGetSettingParamsError('Params not valid.');
    }

    return new GetSettingParams(
      code,
    );
  }

  private constructor(
    public code: SettingEnum,
  ) {
  }
}

