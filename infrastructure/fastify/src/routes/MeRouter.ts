import { FastifyInstance } from "fastify";

import { paths } from "../../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../../application/services/RepositoryResolverInterface";
import { MeController } from "../controllers/MeController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { TokenManagerInterface } from "../../../../application/services/token/TokenManagerInterface";

export class MeRouter {
  public register(
    app: FastifyInstance,
    repositoryResolver: RepositoryResolverInterface,
    tokenManager: TokenManagerInterface,
  ) {
    const meController = new MeController(repositoryResolver.getUserRepository());

    app.get(paths.me,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager),
        await meController.me(req, res);
      }
    );
  }
}

