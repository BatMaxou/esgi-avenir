import { FastifyInstance } from "fastify";

import { paths } from "../../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../../application/services/RepositoryResolverInterface";
import { TokenManagerInterface } from "../../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { NewsController } from "../controllers/NewsController";
import { SseFastifyServerClient } from "../services/sse/SseFastifyServerClient";
import { CreateNewsPayloadInterface, UpdateNewsPayloadInterface } from "../../../../application/services/api/resources/NewsResourceInterface";
import { RessourceParamsInterface } from "../../../../application/params/RessourceParamsInterface";
import { NewsSearchParams } from "../../../../application/queries/news/GetNewsListQuery";

export class NewsRouter {
  public register(
    app: FastifyInstance,
    repositoryResolver: RepositoryResolverInterface,
    tokenManager: TokenManagerInterface,
    sseServerClient: SseFastifyServerClient,
  ) {
    const newsController = new NewsController(
      repositoryResolver.getNewsRepository(),
      sseServerClient,
    );

    app.get(
      paths.news.subscribe,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        newsController.subscribe(req, res);
      }
    );

    app.post<{Body: CreateNewsPayloadInterface}>(
      paths.news.create,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [RoleEnum.ADVISOR], forbiddenRoles: [RoleEnum.BANNED] });
        await newsController.create(req, res);
      }
    );

    app.put<{Params: RessourceParamsInterface, Body: UpdateNewsPayloadInterface}>(
      paths.news.update(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [RoleEnum.ADVISOR], forbiddenRoles: [RoleEnum.BANNED] });
        await newsController.update(req, res);
      }
    );

    app.get<{Querystring: NewsSearchParams}>(
      paths.news.list(),
      async (req, res) => {
        await newsController.list(req, res);
      }
    );

    app.get<{Params: RessourceParamsInterface}>(
      paths.news.detail(),
      async (req, res) => {
        await newsController.get(req, res);
      }
    );

    app.delete<{Params: RessourceParamsInterface}>(
      paths.news.delete(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [RoleEnum.ADVISOR], forbiddenRoles: [RoleEnum.BANNED] });
        await newsController.delete(req, res);
      }
    );
  }
}

