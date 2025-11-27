import { User } from "./User";
import { UserNotFoundError } from "../errors/entities/user/UserNotFoundError";
import { ChannelInterface } from "../interfaces/ChannelInterface";

export class PrivateChannel implements ChannelInterface {
  public id?: number;

  public static from({
    id,
    title,
    userId,
    user,
    advisorId,
    advisor,
  }: {
    id?: number,
    title: string,
    userId?: number,
    user?: User,
    advisorId?: number,
    advisor?: User,
  }): PrivateChannel | UserNotFoundError {
    const maybeUserId = userId ?? user?.id;
    if (!maybeUserId) {
      return new UserNotFoundError('Channel must have a valid userId or user.');
    }

    const maybeAdvisorId = advisorId ?? advisor?.id;
    if (!maybeAdvisorId) {
      return new UserNotFoundError('Channel must have a valid advisorId or advisor.');
    }

    const privateChannel = new this(
      title,
      maybeUserId,
      maybeAdvisorId,
      user ?? undefined,
      advisor ?? undefined,
    );

    if (id) {
      privateChannel.id = id;
    }

    return privateChannel;
  }

  private constructor(
    public title: string,
    public userId: number,
    public advisorId: number,
    public user?: User,
    public advisor?: User,
  ) {
  }
}
