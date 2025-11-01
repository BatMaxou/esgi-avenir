import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

import { User } from "../../../domain/entities/User";
import { UserRepositoryInterface } from "../../../application/repositories/UserRepositoryInterface";
import { jwtSecret } from "../utils/tools";

declare module 'express' {
    interface Request {
        user?: User;
    }
}

export const authMiddleware = (userRepository: UserRepositoryInterface) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const split = authHeader.split(" ");
    if (split.length < 2) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const [method, token, ...other] = split;
    if (method !== 'Bearer') {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, jwtSecret);
    if (typeof decoded === 'string' || !decoded.data || !decoded.data.id) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    const userId = decoded.data.id;
    const maybeUser = await userRepository.findById(userId);
    if (maybeUser instanceof Error) {
      return response.status(401).json({ message: 'Unauthorized' });
    }

    request.user = maybeUser;

    next();
  };
};
