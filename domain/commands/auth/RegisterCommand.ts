import { InvalidRegisterCommandError } from '../../errors/commands/auth/InvalidRegisterCommandError';

interface Body {
  email?: string;
  password?: string,
  firstName?: string,
  lastName?: string
}

export class RegisterCommand {
  public static from(body: Body): RegisterCommand | InvalidRegisterCommandError {
    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      return new InvalidRegisterCommandError('Payload is not valid.');
    }

    return new RegisterCommand(body.email, body.password, body.firstName, body.lastName);
  }

  private constructor(
    public email: string,
    public password: string,
    public firstName: string,
    public lastName: string,
  ) {
  }
}
