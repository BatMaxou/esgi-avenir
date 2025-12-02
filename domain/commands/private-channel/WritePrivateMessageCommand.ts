import { WritePrivateMessagePayloadInterface } from "../../../application/services/api/resources/PrivateChannelResourceInterface";
import { InvalidWritePrivateMessageCommandError } from "../../errors/commands/private-channel/InvalidWritePrivateMessageCommandError";

interface Body extends WritePrivateMessagePayloadInterface {}

export class WritePrivateMessageCommand {
  public static from(body: Body): WritePrivateMessageCommand | InvalidWritePrivateMessageCommandError {
    if (
      !body.content
      || typeof body.content !== 'string'
    ) {
      return new InvalidWritePrivateMessageCommandError('Payload is not valid.');
    }

    return new WritePrivateMessageCommand(
      body.content,
    );
  }

  private constructor(
    public content: string,
  ) {
  }
}

