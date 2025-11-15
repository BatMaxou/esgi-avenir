import { Setting } from "../../domain/entities/Setting"
import { SettingNotFoundError } from "../../domain/errors/entities/setting/SettingNotFoundError"
import { RepositoryInterface } from "./RepositoryInterface"

export interface SettingRepositoryInterface extends RepositoryInterface {
  upsert: (setting: Setting) => Promise<Setting | SettingNotFoundError>
  findAll: () => Promise<Setting[]>
}
