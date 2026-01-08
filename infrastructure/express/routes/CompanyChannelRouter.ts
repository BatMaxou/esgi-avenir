import { Express } from "express";

import { paths } from "../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../application/services/RepositoryResolverInterface";
import { TokenManagerInterface } from "../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { CompanyChannelController } from "../controllers/CompanyChannelController";
import { WebsocketServerInterface } from "../../../application/services/websocket/WebsocketServerInterface";

export class CompanyChannelRouter {
  public register(
    app: Express,
    repositoryResolver: RepositoryResolverInterface,
    tokenManager: TokenManagerInterface,
    websocketServer: WebsocketServerInterface,
  ) {
    const companyChannelController = new CompanyChannelController(
      repositoryResolver.getMessageRepository(),
      repositoryResolver.getCompanyChannelRepository(),
      websocketServer,
    );

    app.post(
      paths.companyChannel.create,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await companyChannelController.create(req, res);
      }
    );

    app.post(
      paths.companyChannel.writeMessage(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [RoleEnum.ADVISOR, RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await companyChannelController.writeMessage(req, res);
      }
    );

    app.put(
      paths.companyChannel.update(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [RoleEnum.ADVISOR, RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await companyChannelController.update(req, res);
      }
    );

    app.get(
      paths.companyChannel.list,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [RoleEnum.ADVISOR, RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await companyChannelController.list(req, res);
      }
    );

    app.get(
      paths.companyChannel.detail(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [RoleEnum.ADVISOR, RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await companyChannelController.get(req, res);
      }
    );
  }
}

