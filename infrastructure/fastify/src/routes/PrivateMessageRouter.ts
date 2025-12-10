import { FastifyInstance } from "fastify";

import { paths } from "../../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../../application/services/RepositoryResolverInterface";
import { TokenManagerInterface } from "../../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { PrivateMessageController } from "../controllers/PrivateMessageController";
import { CreatePrivateMessagePayloadInterface } from "../../../../application/services/api/resources/PrivateMessageResourceInterface";

export class PrivateMessageRouter {
  public register(
    app: FastifyInstance,
    repositoryResolver: RepositoryResolverInterface,
    tokenManager: TokenManagerInterface,
  ) {
    const privateMessageController = new PrivateMessageController(
      repositoryResolver.getMessageRepository(),
      repositoryResolver.getPrivateChannelRepository(),
    );

    app.post<{Body: CreatePrivateMessagePayloadInterface}>(
      paths.privateMessage.create,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await privateMessageController.create(req, res);
      }
    );
  }
}

