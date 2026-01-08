import { InvalidLoginCommandError } from '../../errors/commands/auth/InvalidLoginCommandError';

export interface LoginBody {
  email?: string;
  password?: string,
}

export class LoginCommand {
  public static from(body: LoginBody): LoginCommand | InvalidLoginCommandError {
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
