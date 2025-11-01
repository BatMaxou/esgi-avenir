import { InvalidRegisterCommandError } from '../../errors/commands/auth/InvalidRegisterCommandError';

export class RegisterCommand {
  public static from(body: {
    email?: string;
    password?: string,
    firstName?: string,
    lastName?: string
  }): RegisterCommand | InvalidRegisterCommandError {
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
