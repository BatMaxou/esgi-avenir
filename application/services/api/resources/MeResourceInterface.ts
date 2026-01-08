import type { User } from "../../../../domain/entities/User";
import { ApiClientError } from "../ApiClientError";

export interface GetMeResponseInterface
  extends Pick<User, "id" | "firstName" | "lastName" | "email" | "roles"> {}

export interface MeResourceInterface {
  get(): Promise<GetMeResponseInterface | ApiClientError>;
}
