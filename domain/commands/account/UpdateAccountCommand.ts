import { InvalidUpdateAccountCommandError } from "../../errors/commands/account/InvalidUpdateAccountCommandError";

interface Body {
  name?: string;
}

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

