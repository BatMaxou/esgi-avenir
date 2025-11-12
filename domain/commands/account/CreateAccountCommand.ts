import { InvalidCreateAccountCommandError } from "../../errors/commands/account/InvalidCreateAccountCommandError";

interface Body {
  name?: string;
}

export class CreateAccountCommand {
  public static from(body: Body): CreateAccountCommand | InvalidCreateAccountCommandError {
    if (!body.name) {
      return new InvalidCreateAccountCommandError('Payload is not valid.');
    }

    return new CreateAccountCommand(
      body.name,
    );
  }

  private constructor(
    public name: string,
  ) {
  }
}

