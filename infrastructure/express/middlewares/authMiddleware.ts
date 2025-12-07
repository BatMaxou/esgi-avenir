import { NextFunction, Request, Response } from "express";

import { AuthMiddlewareUsecase } from "../../../application/usecases/middlewares/AuthMiddlewareUsecase";
import { UserRepositoryInterface } from "../../../application/repositories/UserRepositoryInterface";
import { TokenManagerInterface } from "../../../application/services/token/TokenManagerInterface";
import { UnauthorizedError } from "../../../application/errors/middlewares/UnauthorizedError";

export const authMiddleware = (
  userRepository: UserRepositoryInterface,
  tokenManager: TokenManagerInterface,
) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const authHeader = request.headers.authorization;

    const middlewareUsecase = new AuthMiddlewareUsecase(userRepository, tokenManager);
    const maybeUser = await middlewareUsecase.execute(authHeader);

    if (maybeUser instanceof UnauthorizedError) {
      return response.status(401).json({
        error: maybeUser.message,
      });
    }

    request.user = maybeUser;

    next();
  };
};
