import { InvalidUpdateAccountCommandError } from "../../errors/commands/account/InvalidUpdateAccountCommandError";
import { UpdateAccountPayloadInterface } from "../../services/api/resources/AccountResourceInterface";

interface Body extends Partial<UpdateAccountPayloadInterface> {}

export class UpdateAccountCommand {
  public static from(body: Body): UpdateAccountCommand | InvalidUpdateAccountCommandError {
    if (!body.name) {
      return new InvalidUpdateAccountCommandError('Payload is not valid.');
    }

    return new UpdateAccountCommand(
      body.name,
    );
  }

  private constructor(
    public name: string,
  ) {
  }
}

