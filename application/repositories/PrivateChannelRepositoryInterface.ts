import { UserNotFoundError } from "../../domain/errors/entities/user/UserNotFoundError"
import { RepositoryInterface } from "./RepositoryInterface"
import { PrivateChannel } from "../../domain/entities/PrivateChannel"
import { ChannelNotFoundError } from "../../domain/errors/entities/channel/ChannelNotFoundError"

export type UpdatePrivateChannelPayload = Omit<
  Partial<PrivateChannel>,
  'userId' | 'user'
> & { id: number }

export interface PrivateChannelRepositoryInterface extends RepositoryInterface {
  create: (privateChannel: PrivateChannel) => Promise<PrivateChannel | UserNotFoundError>
  update: (privateChannel: UpdatePrivateChannelPayload) => Promise<PrivateChannel | ChannelNotFoundError | UserNotFoundError>
  findById: (id: number) => Promise<PrivateChannel | ChannelNotFoundError>
  findAllByUser: (userId: number) => Promise<PrivateChannel[]>
  findAllByAdvisor: (advisor: number) => Promise<PrivateChannel[]>
}
