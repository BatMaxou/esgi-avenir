import { Express } from "express";

import { paths } from "../../../application/services/api/paths";
import { AuthController } from "../controllers/AuthController";
import { RepositoryResolverInterface } from "../../../application/services/RepositoryResolverInterface";
import { PasswordHasherInterface } from "../../../application/services/password/PasswordHasherInterface";
import { UniqueIdGeneratorInterface } from "../../../application/services/uid/UniqueIdGeneratorInterface";
import { MailerInterface } from "../../../application/services/email/MailerInterface";
import { TokenManagerInterface } from "../../../application/services/token/TokenManagerInterface";

export class AuthRouter {
  public register(
    app: Express,
    repositoryResolver: RepositoryResolverInterface,
    passwordHasher: PasswordHasherInterface,
    uniqueIdGenerator: UniqueIdGeneratorInterface,
    mailer: MailerInterface,
    tokenManager: TokenManagerInterface,
  ) {
    const authContoller = new AuthController(repositoryResolver.getUserRepository(), mailer, passwordHasher, uniqueIdGenerator, tokenManager);

    app.post(paths.login,  async (req, res) => {
      await authContoller.login(req, res);
    });

    app.post(paths.register,  async (req, res) => {
      await authContoller.register(req, res);
    });

    app.post(paths.confirm,  async (req, res) => {
      await authContoller.confirm(req, res);
    });
  }
}

