import { RoleEnum } from '../../enums/RoleEnum';
import { InvalidCreateUserCommandError } from '../../errors/commands/user/InvalidCreateUserCommandError';

interface Body {
  email?: string;
  password?: string,
  firstName?: string,
  lastName?: string
  roles?: string[],
}

export class CreateUserCommand {
  public static from(body: Body): CreateUserCommand | InvalidCreateUserCommandError {
    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      return new InvalidCreateUserCommandError('Payload is not valid.');
    }

    const roles = body.roles;
    if (roles) {
      if (!Array.isArray(roles)) {
        return new InvalidCreateUserCommandError('Roles must be an array.');
      }

      const validRoles = Object.values(RoleEnum);
      const invalidRoles = roles.filter(role => !validRoles.includes(role as RoleEnum));
      if (invalidRoles.length > 0) {
        return new InvalidCreateUserCommandError(`Invalid roles: ${invalidRoles.join(', ')}`);
      }
    }

    return new CreateUserCommand(body.email, body.password, body.firstName, body.lastName, roles as RoleEnum[] | undefined);
  }

  private constructor(
    public email: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public roles?: RoleEnum[],
  ) {
  }
}

