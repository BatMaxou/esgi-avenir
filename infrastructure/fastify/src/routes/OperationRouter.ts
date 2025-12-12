import { FastifyInstance } from "fastify";

import { paths } from "../../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../../application/services/RepositoryResolverInterface";
import { TokenManagerInterface } from "../../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { OperationController } from "../controllers/OperationController";
import { CreateOperationPayloadInterface } from "../../../../application/services/api/resources/OperationResourceInterface";

export class OperationRouter {
  public register(
    app: FastifyInstance,
    repositoryResolver: RepositoryResolverInterface,
    tokenManager: TokenManagerInterface,
  ) {
    const operationController = new OperationController(
      repositoryResolver.getAccountRepository(),
      repositoryResolver.getOperationRepository(),
    );

    app.post<{Body: CreateOperationPayloadInterface}>(
      paths.operation.create,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await operationController.create(req, res);
      }
    );
  }
}

