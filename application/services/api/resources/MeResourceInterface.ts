import type { User } from "../../../../domain/entities/User";
import { ApiClientInterface } from "../ApiClientInterface";
import { paths } from "../paths";

export interface MeResourceInterface {
  get(): Promise<User>;
}

