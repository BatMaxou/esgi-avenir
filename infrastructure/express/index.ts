import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { RepositoryResolver } from "../adapters/services/RepositoryResolver";
import { databaseDsn, databaseSource, mailerHost, mailerPort, mailerFrom, jwtSecret } from "./utils/tools";
import { UserFixtures } from "./fixtures/UserFixtures";
import { RepositoryResolverInterface } from "../../application/services/RepositoryResolverInterface";
import { MeController } from "./controllers/MeController";
import { paths } from "../../application/services/api/paths";
import { AuthController } from "./controllers/AuthController";
import { authMiddleware } from "./middlewares/authMiddleware";
import { Mailer } from "../adapters/nodemailer/services/Mailer";
import { PasswordHasher } from "../adapters/bcrypt/services/PasswordHasher";
import { UniqueIdGenerator } from "../adapters/uuid/services/UniqueIdGenerator";
import { TokenManager } from "../adapters/jwt/services/TokenManager";
import { UserController } from "./controllers/UserController";
import { roleMiddleware } from "./middlewares/roleMiddleware";
import { RoleEnum } from "../../domain/enums/RoleEnum";

const startServer = async () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  const repositoryResolver = new RepositoryResolver(databaseSource);
  const mailer = new Mailer(mailerHost, mailerPort, mailerFrom);
  const passwordHasher = new PasswordHasher();
  const uniqueIdGenerator = new UniqueIdGenerator();
  const tokenManager = new TokenManager(jwtSecret);

  const meController = new MeController(repositoryResolver.getUserRepository());
  const authContoller = new AuthController(repositoryResolver.getUserRepository(), mailer, passwordHasher, uniqueIdGenerator, tokenManager);
  const userController = new UserController(repositoryResolver.getUserRepository(), passwordHasher, uniqueIdGenerator, mailer);

  app.get('/', (_, res) => {
    res.send("Hello World!");
  });

  app.get(paths.me, authMiddleware(repositoryResolver.getUserRepository(), tokenManager), async (req, res) => {
    await meController.me(req, res);
  });

  app.post(paths.login,  async (req, res) => {
    await authContoller.login(req, res);
  });

  app.post(paths.register,  async (req, res) => {
    await authContoller.register(req, res);
  });

  app.post(paths.confirm,  async (req, res) => {
    await authContoller.confirm(req, res);
  });

  app.get(
    paths.user.detail(),
    authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
    roleMiddleware({ mandatoryRoles: [RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] }),
    async (req, res) => {
      await userController.get(req, res);
    }
  )

  app.get(
    paths.user.list,
    authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
    roleMiddleware({ mandatoryRoles: [RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] }),
    async (req, res) => {
      await userController.list(req, res);
    }
  );

  app.post(
    paths.user.create,
    authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
    roleMiddleware({ mandatoryRoles: [RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] }),
    async (req, res) => {
      await userController.create(req, res);
    }
  );

  app.put(
    paths.user.update(),
    authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
    roleMiddleware({ mandatoryRoles: [RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] }),
    async (req, res) => {
      await userController.update(req, res);
    }
  );

  app.delete(
    paths.user.delete(),
    authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
    roleMiddleware({ mandatoryRoles: [RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] }),
    async (req, res) => {
      await userController.delete(req, res);
    }
  );

  app.listen(3000, () => console.log(`Listening on port 3000`));
};

startServer().catch(console.error);
