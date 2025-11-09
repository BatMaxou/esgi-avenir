import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { RepositoryResolver } from "../adapters/services/RepositoryResolver";
import { Mailer } from "../adapters/nodemailer/services/Mailer";
import { PasswordHasher } from "../adapters/bcrypt/services/PasswordHasher";
import { UniqueIdGenerator } from "../adapters/uuid/services/UniqueIdGenerator";
import { TokenManager } from "../adapters/jwt/services/TokenManager";
import { AuthRouter } from "./routes/AuthRouter";
import { MeRouter } from "./routes/MeRouter";
import { UserRouter } from "./routes/UserRouter";
import { databaseSource, mailerHost, mailerPort, mailerFrom, jwtSecret } from "./utils/tools";

const startServer = async () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  const repositoryResolver = new RepositoryResolver(databaseSource);
  const mailer = new Mailer(mailerHost, mailerPort, mailerFrom);
  const passwordHasher = new PasswordHasher();
  const uniqueIdGenerator = new UniqueIdGenerator();
  const tokenManager = new TokenManager(jwtSecret);

  app.get('/', (_, res) => {
    res.send("Hello World!");
  });

  const authRouter = new AuthRouter();
  const registerAuthRoutes = authRouter.register(
    app,
    repositoryResolver,
    passwordHasher,
    uniqueIdGenerator,
    mailer,
    tokenManager,
  );

  const meRouter = new MeRouter();
  const registerMeRoutes = meRouter.register(
    app,
    repositoryResolver,
    tokenManager,
  );

  const userRouter = new UserRouter();
  const registerUserRoutes = userRouter.register(
    app,
    repositoryResolver,
    mailer,
    passwordHasher,
    uniqueIdGenerator,
    tokenManager,
  );

  app.listen(3000, () => console.log(`Listening on port 3000`));
};

startServer().catch(console.error);
