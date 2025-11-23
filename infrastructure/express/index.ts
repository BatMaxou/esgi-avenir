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
import { AccountRouter } from "./routes/AccountRouter";
import { OperationRouter } from "./routes/OperationRouter";
import { Scheduler } from "../adapters/nodecron/services/Scheduler";
import { Calendar } from "./calendar/Calendar";
import { SettingRouter } from "./routes/SettingRouter";
import { StockRouter } from "./routes/StockRouter";
import { StockOrderRouter } from "./routes/StockOrderRouter";
import { FinancialSecurityRouter } from "./routes/FinancialSecurityRouter";

const startServer = async () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  const repositoryResolver = new RepositoryResolver(databaseSource);
  const mailer = new Mailer(mailerHost, mailerPort, mailerFrom);
  const passwordHasher = new PasswordHasher();
  const uniqueIdGenerator = new UniqueIdGenerator();
  const tokenManager = new TokenManager(jwtSecret);
  const scheduler = new Scheduler();

  app.get('/', (_, res) => {
    res.send("Hello World!");
  });

  (new AuthRouter()).register(
    app,
    repositoryResolver,
    passwordHasher,
    uniqueIdGenerator,
    mailer,
    tokenManager,
  );

  (new MeRouter()).register(
    app,
    repositoryResolver,
    tokenManager,
  );

  (new UserRouter()).register(
    app,
    repositoryResolver,
    mailer,
    passwordHasher,
    uniqueIdGenerator,
    tokenManager,
  );

  (new AccountRouter()).register(
    app,
    repositoryResolver,
    mailer,
    tokenManager,
  );

  (new OperationRouter()).register(
    app,
    repositoryResolver,
    tokenManager,
  );

  (new SettingRouter()).register(
    app,
    repositoryResolver,
    mailer,
    tokenManager,
  );

  (new StockRouter()).register(
    app,
    repositoryResolver,
    tokenManager,
    mailer,
  );

  (new StockOrderRouter()).register(
    app,
    repositoryResolver,
    mailer,
    tokenManager,
  );

  (new FinancialSecurityRouter()).register(
    app,
    repositoryResolver,
    tokenManager,
  );

  new Calendar(repositoryResolver, scheduler);

  app.listen(3000, () => console.log(`Listening on port 3000`));
};

startServer().catch(console.error);
