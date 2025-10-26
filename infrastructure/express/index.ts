import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { RepositoryResolver } from "../adapters/services/RepositoryResolver";
import { databaseDsn, databaseSource } from "./utils/tools";
import { UserFixtures } from "./fixtures/UserFixtures";
import { RepositoryResolverInterface } from "../../application/services/RepositoryResolverInterface";
import { MeController } from "./controllers/MeController";
import { paths } from "../../application/services/api/paths";
import { AuthController } from "./controllers/AuthController";
import { authMiddleware } from "./middlewares/authMiddleware";

const startServer = async () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  const repositoryResolver = new RepositoryResolver(databaseSource);

  const meController = new MeController(repositoryResolver.getUserRepository());
  const authContoller = new AuthController(repositoryResolver.getUserRepository());

  app.get('/', (req, res) => {
    res.send("Hello World!");
  });

  app.get(paths.me, authMiddleware(repositoryResolver.getUserRepository()), async (req, res) => {
    await meController.me(req, res);
  });

  app.post(paths.login,  async (req, res) => {
    await authContoller.login(req, res);
  });

  app.listen(3000, () => console.log(`Listening on port 3000`));
};

startServer().catch(console.error);
