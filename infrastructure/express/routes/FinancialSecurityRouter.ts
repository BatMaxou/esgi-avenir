import { Express } from "express";

import { paths } from "../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../application/services/RepositoryResolverInterface";
import { TokenManagerInterface } from "../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { FinancialSecurityController } from "../controllers/FinancialSecurityController";

export class FinancialSecurityRouter {
  public register(
    app: Express,
    repositoryResolver: RepositoryResolverInterface,
    tokenManager: TokenManagerInterface,
  ) {
    const financialSecurityController = new FinancialSecurityController(
      repositoryResolver.getFinancialSecurityRepository(),
    );

    app.get(
      paths.financialSecurity.list,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await financialSecurityController.list(req, res);
      }
    );
  }
}

