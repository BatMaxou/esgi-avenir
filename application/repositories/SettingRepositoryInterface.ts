import { Setting } from "../../domain/entities/Setting"
import { SettingEnum } from "../../domain/enums/SettingEnum"
import { SettingNotFoundError } from "../../domain/errors/entities/setting/SettingNotFoundError"
import { RepositoryInterface } from "./RepositoryInterface"

export interface SettingRepositoryInterface extends RepositoryInterface {
  upsert: (setting: Setting) => Promise<Setting | SettingNotFoundError>
  findByCode: (code: SettingEnum) => Promise<Setting | SettingNotFoundError>
  findAll: () => Promise<Setting[]>
}
