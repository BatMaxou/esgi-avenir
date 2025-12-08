import { RoleEnum } from '../../../domain/enums/RoleEnum';
import { InvalidUpdateUserCommandError } from '../../errors/commands/user/InvalidUpdateUserCommandError';
import { UpdateUserPayloadInterface } from '../../services/api/resources/UserResourceInterface';

interface Body extends Partial<UpdateUserPayloadInterface> {}

export class UpdateUserCommand {
  public static from(body: Body): UpdateUserCommand | InvalidUpdateUserCommandError {
    const roles = body.roles;
    if (roles) {
      if (!Array.isArray(roles)) {
        return new InvalidUpdateUserCommandError('Roles must be an array.');
      }

      if (roles.length === 0) {
        roles.push(RoleEnum.USER);
      };

      const validRoles = Object.values(RoleEnum);
      const invalidRoles = roles.filter(role => !validRoles.includes(role as RoleEnum));
      if (invalidRoles.length > 0) {
        return new InvalidUpdateUserCommandError(`Invalid roles: ${invalidRoles.join(', ')}`);
      }
    }

    return new UpdateUserCommand(body.email, body.password, body.firstName, body.lastName, roles as RoleEnum[] | undefined);
  }

  private constructor(
    public email?: string,
    public password?: string,
    public firstName?: string,
    public lastName?: string,
    public roles?: RoleEnum[],
  ) {
  }
}

