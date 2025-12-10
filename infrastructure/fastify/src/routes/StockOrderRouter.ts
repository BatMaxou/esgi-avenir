import { FastifyInstance } from "fastify";

import { paths } from "../../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../../application/services/RepositoryResolverInterface";
import { MailerInterface } from "../../../../application/services/email/MailerInterface";
import { TokenManagerInterface } from "../../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { StockOrderController } from "../controllers/StockOrderController";
import { RessourceParamsInterface } from "../../../../application/params/RessourceParamsInterface";
import { CreateStockOrderPayloadInterface } from "../../../../application/services/api/resources/StockOrderResourceInterface";
import { AcceptStockOrderBody } from "../../../../application/commands/stock-order/AcceptStockOrderCommand";

export class StockOrderRouter {
  public register(
    app: FastifyInstance,
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

    app.post<{Body: CreateStockOrderPayloadInterface}>(
      paths.stockOrder.create,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await stockOrderController.create(req, res);
      }
    );

    app.post<{Params: RessourceParamsInterface, Body: AcceptStockOrderBody}>(
      paths.stockOrder.accept(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await stockOrderController.accept(req, res);
      }
    );

    app.get(
      paths.stockOrder.list,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await stockOrderController.list(req, res);
      }
    );

    app.get<{Params: RessourceParamsInterface}>(
      paths.stockOrder.match(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await stockOrderController.match(req, res);
      }
    );

    app.delete<{Params: RessourceParamsInterface}>(
      paths.stockOrder.delete(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await stockOrderController.delete(req, res);
      }
    );
  }
}

