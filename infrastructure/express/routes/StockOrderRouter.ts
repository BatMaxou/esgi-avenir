import { Express } from "express";

import { paths } from "../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../application/services/RepositoryResolverInterface";
import { MailerInterface } from "../../../application/services/email/MailerInterface";
import { TokenManagerInterface } from "../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { StockOrderController } from "../controllers/StockOrderController";

export class StockOrderRouter {
  public register(
    app: Express,
    repositoryResolver: RepositoryResolverInterface,
    mailer: MailerInterface,
    tokenManager: TokenManagerInterface,
  ) {
    const stockOrderController = new StockOrderController(
      repositoryResolver.getStockRepository(),
      repositoryResolver.getStockOrderRepository(),
      repositoryResolver.getOperationRepository(),
      repositoryResolver.getSettingRepository(),
      repositoryResolver.getFinancialSecurityRepository(),
      mailer,
    );

    app.post(
      paths.stockOrder.create,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await stockOrderController.create(req, res);
      }
    );

    app.post(
      paths.stockOrder.accept(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await stockOrderController.accept(req, res);
      }
    );

    app.get(
      paths.stockOrder.list,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await stockOrderController.list(req, res);
      }
    );

    app.get(
      paths.stockOrder.match(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await stockOrderController.match(req, res);
      }
    );

    app.delete(
      paths.stockOrder.delete(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await stockOrderController.delete(req, res);
      }
    );
  }
}

