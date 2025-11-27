import { User } from "./User";
import { UserNotFoundError } from "../errors/entities/user/UserNotFoundError";

export class Notification {
  public id?: number;

  public static from({
    id,
    content,
    advisorId,
    advisor,
    userId,
    user,
  }: {
    id?: number,
    content: string,
    advisorId?: number,
    advisor?: User,
    userId?: number,
    user?: User,
  }): Notification | UserNotFoundError {
    const maybeAdvisorId = advisorId ?? advisor?.id;
    if (!maybeAdvisorId) {
      return new UserNotFoundError('Notification must have a valid advisorId or advisor.');
    }

    const maybeUserId = userId ?? user?.id;

    const notification = new this(
      content,
      maybeAdvisorId,
      maybeUserId,
      advisor ?? undefined,
      user ?? undefined,
    );

    if (id) {
      notification.id = id;
    }

    return notification;
  }

  private constructor(
    public content: string,
    public advisorId: number,
    public userId?: number,
    public advisor?: User,
    public user?: User,
  ) {
  }
}
