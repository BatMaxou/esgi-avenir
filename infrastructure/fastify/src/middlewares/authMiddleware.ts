import { FastifyRequest, FastifyReply } from "fastify";

import { AuthMiddlewareUsecase } from "../../../../application/usecases/middlewares/AuthMiddlewareUsecase";
import { UserRepositoryInterface } from "../../../../application/repositories/UserRepositoryInterface";
import { TokenManagerInterface } from "../../../../application/services/token/TokenManagerInterface";
import { UnauthorizedError } from "../../../../application/errors/middlewares/UnauthorizedError";

export const authMiddleware = async (
  request: FastifyRequest,
  response: FastifyReply,
  userRepository: UserRepositoryInterface,
  tokenManager: TokenManagerInterface,
) => {
  const authHeader = request.headers.authorization;

  const middlewareUsecase = new AuthMiddlewareUsecase(userRepository, tokenManager);
  const maybeUser = await middlewareUsecase.execute(authHeader);

  if (maybeUser instanceof UnauthorizedError) {
    return response.status(401).send({
      error: maybeUser.message,
    });
  }

  request.user = maybeUser;

  return request;
};
