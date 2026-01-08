import { Message } from "../../domain/entities/Message"
import { UserNotFoundError } from "../../domain/errors/entities/user/UserNotFoundError"
import { RepositoryInterface } from "./RepositoryInterface"
import { ChannelNotFoundError } from "../../domain/errors/entities/channel/ChannelNotFoundError"

export interface MessageRepositoryInterface extends RepositoryInterface {
  createPrivate: (message: Message) => Promise<Message | UserNotFoundError | ChannelNotFoundError>
  createCompany: (message: Message) => Promise<Message | UserNotFoundError | ChannelNotFoundError>
  findByCompanyChannel: (id: number) => Promise<Message[]>
  findByPrivateChannel: (id: number) => Promise<Message[]>
}
