import { Notification } from "../../domain/entities/Notification"
import { UserNotFoundError } from "../../domain/errors/entities/user/UserNotFoundError"
import { RepositoryInterface } from "./RepositoryInterface"

export interface NotificationRepositoryInterface extends RepositoryInterface {
  create: (notification: Notification) => Promise<Notification | UserNotFoundError>
  findAllByUser: (userId: number) => Promise<Notification[]>
}
