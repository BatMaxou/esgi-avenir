import { FastifyReply, FastifyRequest } from "fastify";

import { UserRepositoryInterface } from "../../../../application/repositories/UserRepositoryInterface";
import { MeUsecase } from "../../../../application/usecases/me/MeUsecase";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";

export class MeController {
  public constructor(
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async me(request: FastifyRequest, response: FastifyReply) {
    if (!request.user || !request.user.id) {
      return response.status(401).send({
        error: "Unauthorized.",
      });
    }

    const meUsecase = new MeUsecase(this.userRepository);
    const maybeUser = await meUsecase.execute(request.user.id);

    if (maybeUser instanceof UserNotFoundError) {
      return response.status(404).send({
        error: maybeUser.message,
      });
    }

    response.status(200).send({
      id: maybeUser.id,
      email: maybeUser.email,
      firstName: maybeUser.firstName,
      lastName: maybeUser.lastName,
      roles: maybeUser.roles,
    });
  }
}
