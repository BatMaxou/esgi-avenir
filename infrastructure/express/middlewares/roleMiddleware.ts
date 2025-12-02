import { NextFunction, Request, Response } from "express";

import { RoleEnum } from "../../../domain/enums/RoleEnum";

type Parameters = {
  mandatoryRoles?: RoleEnum[];
  forbiddenRoles?: RoleEnum[];
}

export const roleMiddleware = ({ mandatoryRoles, forbiddenRoles }: Parameters) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    if (!mandatoryRoles && !forbiddenRoles) {
      return next();
    }

    const user = request.user;
    if (!user) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    if (mandatoryRoles && mandatoryRoles.length > 0 && mandatoryRoles.every(role => !user.roles.includes(role))) {
      return response.status(403).json({ message: 'Forbidden' });
    }

    if (forbiddenRoles && forbiddenRoles.some(role => user.roles.includes(role))) {
      return response.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};
