import { InvalidConfirmAccountCommandError } from '../../errors/commands/auth/InvalidConfirmAccountCommandError';
import { InvalidRegisterCommandError } from '../../errors/commands/auth/InvalidRegisterCommandError';

export class ConfirmAccountCommand {
  public static from(body: {
    token?: string
  }): ConfirmAccountCommand | InvalidConfirmAccountCommandError {
    if (!body.token) {
      return new InvalidConfirmAccountCommandError('Payload is not valid.');
    }

    return new ConfirmAccountCommand(body.token);
  }

  private constructor(
    public token: string,
  ) {
  }
}
