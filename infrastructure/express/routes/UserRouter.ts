import { Express } from "express";

import { paths } from "../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../application/services/RepositoryResolverInterface";
import { MailerInterface } from "../../../application/services/email/MailerInterface";
import { PasswordHasherInterface } from "../../../application/services/password/PasswordHasherInterface";
import { UniqueIdGeneratorInterface } from "../../../application/services/uid/UniqueIdGeneratorInterface";
import { TokenManagerInterface } from "../../../application/services/token/TokenManagerInterface";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../domain/enums/RoleEnum";

export class UserRouter {
  public register(
    app: Express,
    repositoryResolver: RepositoryResolverInterface,
    mailer: MailerInterface,
    passwordHasher: PasswordHasherInterface,
    uniqueIdGenerator: UniqueIdGeneratorInterface,
    tokenManager: TokenManagerInterface,
  ) {
    const userController = new UserController(repositoryResolver.getUserRepository(), passwordHasher, uniqueIdGenerator, mailer);

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
      roleMiddleware({ mandatoryRoles: [RoleEnum.DIRECTOR, RoleEnum.ADVISOR], forbiddenRoles: [RoleEnum.BANNED] }),
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

    app.post(
      paths.user.ban(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await userController.ban(req, res);
      }
    );

    app.post(
      paths.user.unban(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [RoleEnum.DIRECTOR], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await userController.unban(req, res);
      }
    );
  }
}

