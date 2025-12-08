import { InvalidCreatePrivateMessageCommandError } from "../../errors/commands/private-message/InvalidCreatePrivateMessageCommandError";
import { CreatePrivateMessagePayloadInterface } from "../../../application/services/api/resources/PrivateMessageResourceInterface";

interface Body extends Partial<CreatePrivateMessagePayloadInterface> {}

export class CreatePrivateMessageCommand {
  public static from(body: Body): CreatePrivateMessageCommand | InvalidCreatePrivateMessageCommandError {
    if (
      !body.content
      || typeof body.content !== 'string'
      || !body.title
      || typeof body.title !== 'string'
    ) {
      return new InvalidCreatePrivateMessageCommandError('Payload is not valid.');
    }

    return new CreatePrivateMessageCommand(
      body.title,
      body.content,
    );
  }

  private constructor(
    public title: string,
    public content: string,
  ) {
  }
}

