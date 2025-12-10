import { FastifyInstance } from "fastify";

import { paths } from "../../../../application/services/api/paths";
import { AuthController } from "../controllers/AuthController";
import { RepositoryResolverInterface } from "../../../../application/services/RepositoryResolverInterface";
import { PasswordHasherInterface } from "../../../../application/services/password/PasswordHasherInterface";
import { UniqueIdGeneratorInterface } from "../../../../application/services/uid/UniqueIdGeneratorInterface";
import { MailerInterface } from "../../../../application/services/email/MailerInterface";
import { TokenManagerInterface } from "../../../../application/services/token/TokenManagerInterface";
import { LoginBody } from "../../../../application/commands/auth/LoginCommand";
import { RegisterBody } from "../../../../application/commands/auth/RegisterCommand";
import { ConfirmBody } from "../../../../application/commands/auth/ConfirmAccountCommand";

export class AuthRouter {
  public register(
    app: FastifyInstance,
    repositoryResolver: RepositoryResolverInterface,
    passwordHasher: PasswordHasherInterface,
    uniqueIdGenerator: UniqueIdGeneratorInterface,
    mailer: MailerInterface,
    tokenManager: TokenManagerInterface,
  ) {
    const authContoller = new AuthController(repositoryResolver.getUserRepository(), mailer, passwordHasher, uniqueIdGenerator, tokenManager);

    app.post<{Body: LoginBody}>(paths.login, async (req, res) => {
      await authContoller.login(req, res);
    });

    app.post<{Body: RegisterBody}>(paths.register, async (req, res) => {
      await authContoller.register(req, res);
    });

    app.post<{Body: ConfirmBody}>(paths.confirm, async (req, res) => {
      await authContoller.confirm(req, res);
    });
  }
}

