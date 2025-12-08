import { InvalidLoginCommandError } from '../../errors/commands/auth/InvalidLoginCommandError';

interface Body {
  email?: string;
  password?: string,
}

export class LoginCommand {
  public static from(body: Body): LoginCommand | InvalidLoginCommandError {
    if (!body.email || !body.password) {
      return new InvalidLoginCommandError('Email and password are required.');
    }

    return new LoginCommand(body.email, body.password);
  }

  private constructor(
    public email: string,
    public password: string,
  ) {
  }
}
