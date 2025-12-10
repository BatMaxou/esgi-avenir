import { FastifyInstance } from "fastify";

import { paths } from "../../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../../application/services/RepositoryResolverInterface";
import { TokenManagerInterface } from "../../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { CompanyChannelController } from "../controllers/CompanyChannelController";
import { RessourceParamsInterface } from "../../../../application/params/RessourceParamsInterface";
import { CreateCompanyChannelPayloadInterface, UpdateCompanyChannelPayloadInterface, WriteCompanyMessagePayloadInterface } from "../../../../application/services/api/resources/CompanyChannelResourceInterface";

export class CompanyChannelRouter {
  public register(
    app: FastifyInstance,
    repositoryResolver: RepositoryResolverInterface,
    tokenManager: TokenManagerInterface,
  ) {
    const companyChannelController = new CompanyChannelController(
      repositoryResolver.getMessageRepository(),
      repositoryResolver.getCompanyChannelRepository(),
    );

    app.post<{Body: CreateCompanyChannelPayloadInterface}>(
      paths.companyChannel.create,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] });
        await companyChannelController.create(req, res);
      }
    );

    app.post<{Params: RessourceParamsInterface, Body: WriteCompanyMessagePayloadInterface}>(
      paths.companyChannel.writeMessage(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [RoleEnum.ADVISOR, RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] });
        await companyChannelController.writeMessage(req, res);
      }
    );

    app.put<{Params: RessourceParamsInterface, Body: UpdateCompanyChannelPayloadInterface}>(
      paths.companyChannel.update(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [RoleEnum.ADVISOR, RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] });
        await companyChannelController.update(req, res);
      }
    );

    app.get(
      paths.companyChannel.list,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [RoleEnum.ADVISOR, RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] });
        await companyChannelController.list(req, res);
      }
    );

    app.get<{Params: RessourceParamsInterface}>(
      paths.companyChannel.detail(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [RoleEnum.ADVISOR, RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] });
        await companyChannelController.get(req, res);
      }
    );
  }
}

