import { FastifyInstance } from "fastify";

import { paths } from "../../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../../application/services/RepositoryResolverInterface";
import { TokenManagerInterface } from "../../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { StockController } from "../controllers/StockController";
import { MailerInterface } from "../../../../application/services/email/MailerInterface";
import { RessourceParamsInterface } from "../../../../application/params/RessourceParamsInterface";
import { CreateStockPayloadInterface, PurchaseBaseStockPayloadInterface, UpdateStockPayloadInterface } from "../../../../application/services/api/resources/StockResourceInterface";
import { StockSearchParams } from "../../../../application/queries/stock/GetStockListQuery";

export class StockRouter {
  public register(
    app: FastifyInstance,
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

    app.post<{Body: CreateStockPayloadInterface}>(
      paths.stock.create,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] });
        await stockController.create(req, res);
      }
    );

    app.put<{Params: RessourceParamsInterface, Body: UpdateStockPayloadInterface}>(
      paths.stock.update(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] });
        await stockController.update(req, res);
      }
    );

    app.get<{Querystring: StockSearchParams}>(
      paths.stock.list(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await stockController.list(req, res);
      }
    );

    app.post<{Params: RessourceParamsInterface, Body: PurchaseBaseStockPayloadInterface}>(
      paths.stock.purchaseBaseStock(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await stockController.purchaseBaseStock(req, res);
      }
    );
  }
}

