import { Request, Response } from "express";
import { UserRepositoryInterface } from "../../../application/repositories/UserRepositoryInterface";
import { EmailValue } from "../../../domain/values/EmailValue";
import { InvalidEmailError } from "../../../domain/errors/values/email/InvalidEmailError";
import { MeUsecase } from "../../../application/usecases/me/MeUsecase";
import { UserNotFoundError } from "../../../domain/errors/entities/user/UserNotFoundError";
import { LoginCommand } from "../../../domain/commands/auth/LoginCommand";

export class MeController {
  public constructor(
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public async me(request: Request, response: Response) {
    if (!request.user || !request.user.id) {
      return response.status(401).json({
        error: 'Unauthorized.',
      });
    }

    const meUsecase = new MeUsecase(this.userRepository);
    const maybeUser = await meUsecase.execute(request.user.id);

    if (maybeUser instanceof UserNotFoundError) {
      return response.status(404).json({
        error: maybeUser.message,
      });
    }

    response.status(200).json(maybeUser);
  }
}
