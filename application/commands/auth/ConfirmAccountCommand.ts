import { InvalidConfirmAccountCommandError } from '../../errors/commands/auth/InvalidConfirmAccountCommandError';
import { InvalidRegisterCommandError } from '../../errors/commands/auth/InvalidRegisterCommandError';

export interface ConfirmBody {
  token?: string
}

export class ConfirmAccountCommand {
  public static from(body: ConfirmBody): ConfirmAccountCommand | InvalidConfirmAccountCommandError {
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
