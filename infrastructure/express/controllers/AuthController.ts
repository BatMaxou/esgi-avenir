import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { UserRepositoryInterface } from "../../../application/repositories/UserRepositoryInterface";
import { EmailValue } from "../../../domain/values/EmailValue";
import { InvalidEmailError } from "../../../domain/errors/values/email/InvalidEmailError";
import { MeUsecase } from "../../../application/usecases/me/MeUsecase";
import { UserNotFoundError } from "../../../domain/errors/entities/user/UserNotFoundError";
import { LoginCommand } from "../../../domain/commands/auth/LoginCommand";
import { InvalidLoginCommandError } from "../../../domain/errors/commands/auth/InvalidLoginCommandError";
import { LoginUsecase } from "../../../application/usecases/auth/LoginUsecase";
import { jwtSecret } from "../utils/tools";

export class AuthController {
  public constructor(
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public async login(request: Request, response: Response) {
    const maybeCommand = LoginCommand.from(request.body);
    if (maybeCommand instanceof InvalidLoginCommandError) {
      return response.status(400).json({
        error: maybeCommand.message,
      });
    }

    const maybeEmail = EmailValue.from(maybeCommand.email);
    if (maybeEmail instanceof InvalidEmailError) {
      return response.status(400).json({
        error: maybeEmail.message,
      });
    }

    const loginUsecase = new LoginUsecase(this.userRepository);
    const maybeUser = await loginUsecase.execute(maybeEmail.value, maybeCommand.password);

    if (maybeUser instanceof UserNotFoundError) {
      return response.status(401).json({
        error: 'Invalid credentials.',
      });
    }

    const token = jwt.sign({
      exp: Date.now() + 60 * 60,
      data: {
        id: maybeUser.id,
      }}, jwtSecret,);

    response.status(200).json({
      token,
    });
  }
}

