import { User } from "./User";
import { UserNotFoundError } from "../errors/entities/user/UserNotFoundError";
import { ChannelInterface } from "../entities/interfaces/ChannelInterface";
import { ChannelNotFoundError } from "../errors/entities/channel/ChannelNotFoundError";

export type WebsocketMessage = {
  id?: number;
  content: string;
  user: {
    id: number;
    firstName?: string;
    lastName?: string;
    roles: string[];
  };
  channel: {
    id: number;
    title?: string;
  };
};

export class Message {
  public id?: number;

  public static from({
    id,
    content,
    userId,
    user,
    channelId,
    channel,
    createdAt,
  }: {
    id?: number;
    content: string;
    userId?: number;
    user?: User;
    channelId?: number;
    channel?: ChannelInterface;
    createdAt?: Date;
  }): Message | UserNotFoundError | ChannelNotFoundError {
    const maybeUserId = userId ?? user?.id;
    if (!maybeUserId) {
      return new UserNotFoundError("Message must have a valid userId or user.");
    }

    const maybeChannelId = channelId ?? channel?.id;
    if (!maybeChannelId) {
      return new ChannelNotFoundError(
        "Message must have a valid channelId or channel."
      );
    }

    const message = new this(
      content,
      maybeUserId,
      maybeChannelId,
      createdAt,
      user ?? undefined,
      channel ?? undefined
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
    public createdAt?: Date,
    public user?: User,
    public channel?: ChannelInterface
  ) {}
}
