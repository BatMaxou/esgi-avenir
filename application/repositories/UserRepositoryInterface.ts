import { RepositoryInterface } from "./RepositoryInterface"
import { User } from "../../domain/entities/User"
import { EmailExistsError } from "../../domain/errors/EmailExistsError"

export interface UserRepositoryInterface extends RepositoryInterface {
  create: (user: User) => Promise<User | EmailExistsError>
}
