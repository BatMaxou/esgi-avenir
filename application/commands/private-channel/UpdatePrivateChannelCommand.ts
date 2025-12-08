import { UpdatePrivateChannelPayloadInterface } from "../../../application/services/api/resources/PrivateChannelResourceInterface";
import { InvalidUpdatePrivateChannelCommandError } from "../../errors/commands/private-channel/InvalidUpdatePrivateChannelCommandError";

interface Body extends Partial<UpdatePrivateChannelPayloadInterface> {}

export class UpdatePrivateChannelCommand {
  public static from(body: Body): UpdatePrivateChannelCommand | InvalidUpdatePrivateChannelCommandError {
    if (
      !body.title
      || typeof body.title !== 'string'
    ) {
      return new InvalidUpdatePrivateChannelCommandError('Payload is not valid.');
    }

    return new UpdatePrivateChannelCommand(
      body.title,
    );
  }

  private constructor(
    public title: string,
  ) {
  }
}

