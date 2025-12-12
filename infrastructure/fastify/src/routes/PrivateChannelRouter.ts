import { FastifyInstance } from "fastify";

import { paths } from "../../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../../application/services/RepositoryResolverInterface";
import { TokenManagerInterface } from "../../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { PrivateChannelController } from "../controllers/PrivateChannelController";
import { UpdatePrivateChannelPayloadInterface, WritePrivateMessagePayloadInterface } from "../../../../application/services/api/resources/PrivateChannelResourceInterface";
import { RessourceParamsInterface } from "../../../../application/params/RessourceParamsInterface";

export class PrivateChannelRouter {
  public register(
    app: FastifyInstance,
    repositoryResolver: RepositoryResolverInterface,
    tokenManager: TokenManagerInterface,
  ) {
    const privateChannelController = new PrivateChannelController(
      repositoryResolver.getMessageRepository(),
      repositoryResolver.getPrivateChannelRepository(),
    );

    app.post<{Params: RessourceParamsInterface, Body: WritePrivateMessagePayloadInterface}>(
      paths.privateChannel.writeMessage(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await privateChannelController.writeMessage(req, res);
      }
    );

    app.put<{Params: RessourceParamsInterface, Body: UpdatePrivateChannelPayloadInterface}>(
      paths.privateChannel.update(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await privateChannelController.update(req, res);
      }
    );

    app.get(
      paths.privateChannel.list,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await privateChannelController.list(req, res);
      }
    );

    app.get<{Params: RessourceParamsInterface}>(
      paths.privateChannel.detail(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await privateChannelController.get(req, res);
      }
    );

    app.post<{Params: RessourceParamsInterface}>(
      paths.privateChannel.attributeTo(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [RoleEnum.ADVISOR], forbiddenRoles: [RoleEnum.BANNED] });
        await privateChannelController.attributeTo(req, res);
      }
    );
  }
}

