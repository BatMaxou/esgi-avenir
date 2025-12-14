import { Express } from "express";

import { paths } from "../../../application/services/api/paths";
import { ssePaths } from "../../../application/services/sse/ssePaths";
import { RepositoryResolverInterface } from "../../../application/services/RepositoryResolverInterface";
import { TokenManagerInterface } from "../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { NewsController } from "../controllers/NewsController";
import { SseExpressServerClient } from "../services/sse/SseExpressServerClient";

export class NewsRouter {
  public register(
    app: Express,
    repositoryResolver: RepositoryResolverInterface,
    tokenManager: TokenManagerInterface,
    sseServerClient: SseExpressServerClient,
  ) {
    const newsController = new NewsController(
      repositoryResolver.getNewsRepository(),
      sseServerClient,
    );

    app.get(
      ssePaths.news.subscribe,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        newsController.subscribe(req, res);
      }
    );

    app.post(
      paths.news.create,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [RoleEnum.ADVISOR], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await newsController.create(req, res);
      }
    );

    app.put(
      paths.news.update(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [RoleEnum.ADVISOR], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await newsController.update(req, res);
      }
    );

    app.get(
      paths.news.list(),
      async (req, res) => {
        await newsController.list(req, res);
      }
    );

    app.get(
      paths.news.detail(),
      async (req, res) => {
        await newsController.get(req, res);
      }
    );

    app.delete(
      paths.news.delete(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [RoleEnum.ADVISOR], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await newsController.delete(req, res);
      }
    );
  }
}

