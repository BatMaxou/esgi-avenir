import { Express } from "express";

import { paths } from "../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../application/services/RepositoryResolverInterface";
import { TokenManagerInterface } from "../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { SettingController } from "../controllers/SettingController";
import { MailerInterface } from "../../../application/services/email/MailerInterface";

export class SettingRouter {
  public register(
    app: Express,
    repositoryResolver: RepositoryResolverInterface,
    mailer: MailerInterface,
    tokenManager: TokenManagerInterface,
  ) {
    const settingController = new SettingController(
      repositoryResolver.getSettingRepository(),
      mailer,
    );

    app.post(
      paths.setting.upsert,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await settingController.upsert(req, res);
      }
    );

    app.get(
      paths.setting.list,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await settingController.list(req, res);
      }
    );
  }
}

