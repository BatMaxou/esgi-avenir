import { RepositoryInterface } from "./RepositoryInterface"
import { User } from "../../domain/entities/User"
import { EmailExistsError } from "../../domain/errors/entities/user/EmailExistsError"
import { EmailValue } from "../../domain/values/EmailValue"
import { UserNotFoundError } from "../../domain/errors/entities/user/UserNotFoundError"
import { PasswordValue } from "../../domain/values/PasswordValue"

export type UpdateUserPayload = Omit<Partial<User>, 'password'> & { id: number, password?: PasswordValue }

export interface UserRepositoryInterface extends RepositoryInterface {
  create: (user: User) => Promise<User | EmailExistsError>
  update: (user: UpdateUserPayload) => Promise<User | UserNotFoundError | EmailExistsError>
  delete: (id: number) => Promise<boolean | UserNotFoundError>
  find: (email: string, password: string) => Promise<User | UserNotFoundError>
  findAll: () => Promise<User[]>
  findByEmail: (email: string) => Promise<User | UserNotFoundError>
  findById: (id: number) => Promise<User | UserNotFoundError>
  findByConfirmationToken: (token: string) => Promise<User | UserNotFoundError>
  findByIds: (ids: number[]) => Promise<User[]>
}
