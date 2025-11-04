import type { User } from "../../../../domain/entities/User";

export interface MeResourceInterface {
  get(): Promise<User>;
}

