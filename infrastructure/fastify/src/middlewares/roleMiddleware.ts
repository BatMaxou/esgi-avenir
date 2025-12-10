import { FastifyRequest, FastifyReply } from "fastify";

import { RoleMiddlewareUsecase } from "../../../../application/usecases/middlewares/RoleMiddlewareUsecase";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { UnauthorizedError } from "../../../../application/errors/middlewares/UnauthorizedError";
import { ForbiddenError } from "../../../../application/errors/middlewares/ForbiddenError";

type Parameters = {
  mandatoryRoles?: RoleEnum[];
  forbiddenRoles?: RoleEnum[];
}

export const roleMiddleware = async (
  request: FastifyRequest,
  response: FastifyReply,
  { mandatoryRoles, forbiddenRoles }: Parameters
) => {
  const middlewareUsecase = new RoleMiddlewareUsecase();
  const maybeSuccess = await middlewareUsecase.execute(request.user, mandatoryRoles, forbiddenRoles)

  if (maybeSuccess instanceof UnauthorizedError) {
    return response.status(401).send({
      error: maybeSuccess.message,
    });
  }

  if (maybeSuccess instanceof ForbiddenError) {
    return response.status(403).send({
      error: maybeSuccess.message,
    });
  }
};
