import { NextFunction, Request, Response } from "express";

import { User } from "../../../domain/entities/User";
import { UserRepositoryInterface } from "../../../application/repositories/UserRepositoryInterface";
import { TokenManagerInterface } from "../../../application/services/token/TokenManagerInterface";

declare module 'express' {
  interface Request {
    user?: User;
  }
}

export const authMiddleware = (
  userRepository: UserRepositoryInterface,
  tokenManager: TokenManagerInterface,
) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const split = authHeader.split(" ");
    if (split.length < 2) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const [method, token, ..._] = split;
    if (method !== 'Bearer') {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = tokenManager.verify(token);
    if (!decoded || !decoded.id) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const maybeUser = await userRepository.findById(decoded.id);
    if (maybeUser instanceof Error) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    request.user = maybeUser;

    next();
  };
};
