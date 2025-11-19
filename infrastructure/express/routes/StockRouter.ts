import { Express } from "express";

import { paths } from "../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../application/services/RepositoryResolverInterface";
import { TokenManagerInterface } from "../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { StockController } from "../controllers/StockController";
import { MailerInterface } from "../../../application/services/email/MailerInterface";

export class StockRouter {
  public register(
    app: Express,
    repositoryResolver: RepositoryResolverInterface,
    tokenManager: TokenManagerInterface,
    mailer: MailerInterface,
  ) {
    const stockController = new StockController(
      repositoryResolver.getStockRepository(),
      repositoryResolver.getStockOrderRepository(),
      repositoryResolver.getFinancialSecurityRepository(),
      repositoryResolver.getOperationRepository(),
      repositoryResolver.getSettingRepository(),
      repositoryResolver.getAccountRepository(),
      mailer,
    );

    app.post(
      paths.stock.create,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await stockController.create(req, res);
      }
    );

    app.put(
      paths.stock.update(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await stockController.update(req, res);
      }
    );

    app.get(
      paths.stock.list(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await stockController.list(req, res);
      }
    );

    app.post(
      paths.stock.purchaseBaseStock(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await stockController.purchaseBaseStock(req, res);
      }
    );
  }
}

