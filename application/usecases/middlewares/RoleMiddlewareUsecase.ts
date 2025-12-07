import { User } from '../../../domain/entities/User';
import { RoleEnum } from '../../../domain/enums/RoleEnum';
import { ForbiddenError } from '../../errors/middlewares/ForbiddenError';
import { UnauthorizedError } from '../../errors/middlewares/UnauthorizedError';

export class RoleMiddlewareUsecase {
  public async execute(
    user?: User,
    mandatoryRoles?: RoleEnum[],
    forbiddenRoles?: RoleEnum[],
  ): Promise<true | UnauthorizedError | ForbiddenError> {
    if (!mandatoryRoles && !forbiddenRoles) {
      return true;
    }

    if (!user) {
      return new UnauthorizedError();
    }

    if (mandatoryRoles && mandatoryRoles.length > 0 && mandatoryRoles.every(role => !user.roles.includes(role))) {
      return new ForbiddenError();
    }

    if (forbiddenRoles && forbiddenRoles.some(role => user.roles.includes(role))) {
      return new ForbiddenError();
    }

    return true;
  }
}

