import { FastifyInstance } from "fastify";

import { paths } from "../../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../../application/services/RepositoryResolverInterface";
import { MailerInterface } from "../../../../application/services/email/MailerInterface";
import { TokenManagerInterface } from "../../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { AccountController } from "../controllers/AccountController";
import { CreateAccountPayloadInterface } from "../../../../application/services/api/resources/AccountResourceInterface";
import { RessourceParamsInterface } from "../../../../application/params/RessourceParamsInterface";
import { UpdateAccountPayloadInterface } from "../../../../application/services/api/resources/AccountResourceInterface";

export class AccountRouter {
  public register(
    app: FastifyInstance,
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

    app.post<{Body: CreateAccountPayloadInterface}>(
      paths.account.create,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await accountController.create(req, res);
      }
    );

    app.post<{Params: RessourceParamsInterface, Body: CreateAccountPayloadInterface}>(
      paths.account.createSavings,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await accountController.createSavings(req, res);
      }
    );

    app.put<{Params: RessourceParamsInterface, Body: UpdateAccountPayloadInterface}>(
      paths.account.update(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await accountController.update(req, res);
      }
    );

    app.get(
      paths.account.list,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await accountController.list(req, res);
      }
    );

    app.get<{Params: RessourceParamsInterface}>(
      paths.account.detail(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await accountController.get(req, res);
      }
    );

    app.delete<{Params: RessourceParamsInterface}>(
      paths.account.delete(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await accountController.delete(req, res);
      }
    );

    app.get<{Params: RessourceParamsInterface}>(
      paths.account.operations(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await accountController.listOperations(req, res);
      }
    );
  }
}

