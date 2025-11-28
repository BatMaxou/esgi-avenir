import { User } from "./User";
import { UserNotFoundError } from "../errors/entities/user/UserNotFoundError";
import { ChannelInterface } from "../interfaces/ChannelInterface";
import { ChannelNotFoundError } from "../errors/entities/channel/ChannelNotFoundError";

export class Message {
  public id?: number;

  public static from({
    id,
    content,
    userId,
    user,
    channelId,
    channel,
  }: {
    id?: number,
    content: string,
    userId?: number,
    user?: User,
    channelId?: number,
    channel?: ChannelInterface,
  }): Message | UserNotFoundError | ChannelNotFoundError {
    const maybeUserId = userId ?? user?.id;
    if (!maybeUserId) {
      return new UserNotFoundError('Message must have a valid userId or user.');
    }

    const maybeChannelId = channelId ?? channel?.id;
    if (!maybeChannelId) {
      return new ChannelNotFoundError('Message must have a valid channelId or channel.');
    }

    const message = new this(
      content,
      maybeUserId,
      maybeChannelId,
      user ?? undefined,
      channel ?? undefined,
    );

    if (id) {
      message.id = id;
    }

    return message;
  }

  private constructor(
    public content: string,
    public userId: number,
    public channelId: number,
    public user?: User,
    public channel?: ChannelInterface,
  ) {
  }
}
