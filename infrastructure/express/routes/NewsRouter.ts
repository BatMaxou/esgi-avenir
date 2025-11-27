import { Express } from "express";

import { paths } from "../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../application/services/RepositoryResolverInterface";
import { TokenManagerInterface } from "../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { NewsController } from "../controllers/NewsController";

export class NewsRouter {
  public register(
    app: Express,
    repositoryResolver: RepositoryResolverInterface,
    tokenManager: TokenManagerInterface,
  ) {
    const newsController = new NewsController(repositoryResolver.getNewsRepository());

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

