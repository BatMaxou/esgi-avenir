import { Express } from "express";

import { paths } from "../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../application/services/RepositoryResolverInterface";
import { MeController } from "../controllers/MeController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { TokenManagerInterface } from "../../../application/services/token/TokenManagerInterface";

export class MeRouter {
  public register(
    app: Express,
    repositoryResolver: RepositoryResolverInterface,
    tokenManager: TokenManagerInterface,
  ) {
    const meController = new MeController(repositoryResolver.getUserRepository());

    app.get(paths.me,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      async (req, res) => {
        await meController.me(req, res);
      }
    );
  }
}

