import { InvalidCreateNotificationCommandError } from "../../errors/commands/notification/InvalidCreateNotificationCommandError";
import { CreateNotificationPayloadInterface } from "../../../application/services/api/resources/NotificationResourceInterface";

interface Body extends Partial<CreateNotificationPayloadInterface> {}

export class CreateNotificationCommand {
  public static from(body: Body): CreateNotificationCommand | InvalidCreateNotificationCommandError {
    if (
      !body.content
      || typeof body.content !== 'string'
      || (body.userId !== undefined && typeof body.userId !== 'number')
    ) {
      return new InvalidCreateNotificationCommandError('Payload is not valid.');
    }

    return new CreateNotificationCommand(
      body.content,
      body.userId,
    );
  }

  private constructor(
    public content: string,
    public userId?: number,
  ) {
  }
}

