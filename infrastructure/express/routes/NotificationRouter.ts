import { Express } from "express";

import { paths } from "../../../application/services/api/paths";
import { ssePaths } from "../../../application/services/sse/ssePaths";
import { RepositoryResolverInterface } from "../../../application/services/RepositoryResolverInterface";
import { TokenManagerInterface } from "../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { NotificationController } from "../controllers/NotificationController";
import { SseExpressServerClient } from "../services/sse/SseExpressServerClient";

export class NotificationRouter {
  public register(
    app: Express,
    repositoryResolver: RepositoryResolverInterface,
    tokenManager: TokenManagerInterface,
    sseServerClient: SseExpressServerClient,
  ) {
    const notificationController = new NotificationController(
      repositoryResolver.getNotificationRepository(),
      sseServerClient,
    );

    app.get(
      ssePaths.notification.subscribe,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        notificationController.subscribe(req, res);
      }
    );

    app.post(
      paths.notification.create,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [RoleEnum.ADVISOR], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await notificationController.create(req, res);
      }
    );

    app.get(
      paths.notification.list,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await notificationController.list(req, res);
      }
    );
  }
}

