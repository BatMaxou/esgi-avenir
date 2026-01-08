import { Express } from "express";

import { paths } from "../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../application/services/RepositoryResolverInterface";
import { TokenManagerInterface } from "../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { PrivateChannelController } from "../controllers/PrivateChannelController";
import { WebsocketServerInterface } from "../../../application/services/websocket/WebsocketServerInterface";

export class PrivateChannelRouter {
  public register(
    app: Express,
    repositoryResolver: RepositoryResolverInterface,
    tokenManager: TokenManagerInterface,
    websocketServer: WebsocketServerInterface,
  ) {
    const privateChannelController = new PrivateChannelController(
      repositoryResolver.getMessageRepository(),
      repositoryResolver.getPrivateChannelRepository(),
      websocketServer,
    );

    app.post(
      paths.privateChannel.writeMessage(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await privateChannelController.writeMessage(req, res);
      }
    );

    app.put(
      paths.privateChannel.update(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await privateChannelController.update(req, res);
      }
    );

    app.get(
      paths.privateChannel.list,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await privateChannelController.list(req, res);
      }
    );

    app.get(
      paths.privateChannel.detail(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await privateChannelController.get(req, res);
      }
    );

    app.post(
      paths.privateChannel.attributeTo(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [RoleEnum.ADVISOR], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await privateChannelController.attributeTo(req, res);
      }
    );
  }
}

