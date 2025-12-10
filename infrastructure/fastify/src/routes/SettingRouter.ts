import { FastifyInstance } from "fastify";

import { paths } from "../../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../../application/services/RepositoryResolverInterface";
import { TokenManagerInterface } from "../../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { SettingController } from "../controllers/SettingController";
import { MailerInterface } from "../../../../application/services/email/MailerInterface";
import { UpsertSettingPayloadInterface } from "../../../../application/services/api/resources/SettingResourceInterface";
import { SettingParams } from "../../../../application/params/setting/GetSettingParams";

export class SettingRouter {
  public register(
    app: FastifyInstance,
    repositoryResolver: RepositoryResolverInterface,
    mailer: MailerInterface,
    tokenManager: TokenManagerInterface,
  ) {
    const settingController = new SettingController(
      repositoryResolver.getSettingRepository(),
      repositoryResolver.getUserRepository(),
      repositoryResolver.getAccountRepository(),
      mailer,
    );

    app.post<{Body: UpsertSettingPayloadInterface}>(
      paths.setting.upsert,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] });
        await settingController.upsert(req, res);
      }
    );

    app.get(
      paths.setting.list,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] });
        await settingController.list(req, res);
      }
    );

    app.get<{Params: SettingParams}>(
      paths.setting.detail(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await settingController.get(req, res);
      }
    );
  }
}

