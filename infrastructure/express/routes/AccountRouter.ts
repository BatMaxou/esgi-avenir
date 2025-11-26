import { Express } from "express";

import { paths } from "../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../application/services/RepositoryResolverInterface";
import { MailerInterface } from "../../../application/services/email/MailerInterface";
import { TokenManagerInterface } from "../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { AccountController } from "../controllers/AccountController";

export class AccountRouter {
  public register(
    app: Express,
    repositoryResolver: RepositoryResolverInterface,
    mailer: MailerInterface,
    tokenManager: TokenManagerInterface,
  ) {
    const accountController = new AccountController(
      repositoryResolver.getAccountRepository(),
      repositoryResolver.getOperationRepository(),
      repositoryResolver.getBeneficiaryRepository(),
      mailer,
    );

    app.post(
      paths.account.create,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await accountController.create(req, res);
      }
    );

    app.post(
      paths.account.createSavings,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await accountController.createSavings(req, res);
      }
    );

    app.put(
      paths.account.update(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await accountController.update(req, res);
      }
    );

    app.get(
      paths.account.list,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await accountController.list(req, res);
      }
    );

    app.get(
      paths.account.detail(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await accountController.get(req, res);
      }
    );

    app.delete(
      paths.account.delete(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await accountController.delete(req, res);
      }
    );

    app.get(
      paths.account.operations(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await accountController.listOperations(req, res);
      }
    );
  }
}

