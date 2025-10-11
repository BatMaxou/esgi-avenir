import express from "express";

import { RepositoryResolver } from "../adapters/services/RepositoryResolver";
import { databaseSource } from "./utils/tools";
import { UserFixtures } from "./fixtures/UserFixtures";
import { RepositoryResolverInterface } from "../../application/services/RepositoryResolverInterface";

const startServer = async () => {
  const app = express();
  const repositoryResolver = new RepositoryResolver(databaseSource);

  await bootstrap(repositoryResolver);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(3000, () => console.log(`Listening on port 3000`));
};

const bootstrap = async (repositoryResolver: RepositoryResolverInterface) => {
  const userFixtures = new UserFixtures(repositoryResolver.getUserRepository());
  userFixtures.load();
};

startServer().catch(console.error);
