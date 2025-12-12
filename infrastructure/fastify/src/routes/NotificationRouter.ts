import { FastifyInstance } from "fastify";

import { paths } from "../../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../../application/services/RepositoryResolverInterface";
import { TokenManagerInterface } from "../../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { NotificationController } from "../controllers/NotificationController";
import { SseFastifyServerClient } from "../services/sse/SseFastifyServerClient";
import { CreateNotificationPayloadInterface } from "../../../../application/services/api/resources/NotificationResourceInterface";

export class NotificationRouter {
  public register(
    app: FastifyInstance,
    repositoryResolver: RepositoryResolverInterface,
    tokenManager: TokenManagerInterface,
    sseServerClient: SseFastifyServerClient,
  ) {
    const notificationController = new NotificationController(
      repositoryResolver.getNotificationRepository(),
      sseServerClient,
    );
    
    app.get(
      paths.notification.subscribe,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        notificationController.subscribe(req, res);
      }
    );

    app.post<{Body: CreateNotificationPayloadInterface}>(
      paths.notification.create,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [RoleEnum.ADVISOR], forbiddenRoles: [RoleEnum.BANNED] });
        await notificationController.create(req, res);
      }
    );

    app.get(
      paths.notification.list,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await notificationController.list(req, res);
      }
    );
  }
}

