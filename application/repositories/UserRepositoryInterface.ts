import { RepositoryInterface } from "./RepositoryInterface"
import { User } from "../../domain/entities/User"
import { EmailExistsError } from "../../domain/errors/values/email/EmailExistsError"
import { EmailValue } from "../../domain/values/EmailValue"
import { UserNotFoundError } from "../../domain/errors/entities/user/UserNotFoundError"

export interface UserRepositoryInterface extends RepositoryInterface {
  create: (user: User) => Promise<User | EmailExistsError>
  find: (email: string, password: string) => Promise<User | UserNotFoundError>
  findByEmail: (email: string) => Promise<User | UserNotFoundError>
  findById: (id: number) => Promise<User | UserNotFoundError>
}
