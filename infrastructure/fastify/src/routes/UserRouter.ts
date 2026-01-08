import { FastifyInstance } from "fastify";

import { paths } from "../../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../../application/services/RepositoryResolverInterface";
import { MailerInterface } from "../../../../application/services/email/MailerInterface";
import { PasswordHasherInterface } from "../../../../application/services/password/PasswordHasherInterface";
import { UniqueIdGeneratorInterface } from "../../../../application/services/uid/UniqueIdGeneratorInterface";
import { TokenManagerInterface } from "../../../../application/services/token/TokenManagerInterface";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { RessourceParamsInterface } from "../../../../application/params/RessourceParamsInterface";
import {
  CreateUserPayloadInterface,
  UpdateUserPayloadInterface,
} from "../../../../application/services/api/resources/UserResourceInterface";

export class UserRouter {
  public register(
    app: FastifyInstance,
    repositoryResolver: RepositoryResolverInterface,
    mailer: MailerInterface,
    passwordHasher: PasswordHasherInterface,
    uniqueIdGenerator: UniqueIdGeneratorInterface,
    tokenManager: TokenManagerInterface
  ) {
    const userController = new UserController(
      repositoryResolver.getUserRepository(),
      passwordHasher,
      uniqueIdGenerator,
      mailer
    );

    app.get<{ Params: RessourceParamsInterface }>(
      paths.user.detail(),
      async (req, res) => {
        await authMiddleware(
          req,
          res,
          repositoryResolver.getUserRepository(),
          tokenManager
        ),
          await roleMiddleware(req, res, {
            mandatoryRoles: [RoleEnum.DIRECTOR, RoleEnum.ADVISOR],
            forbiddenRoles: [RoleEnum.BANNED],
          }),
          await userController.get(req, res);
      }
    );

    app.get(paths.user.list, async (req, res) => {
      await authMiddleware(
        req,
        res,
        repositoryResolver.getUserRepository(),
        tokenManager
      ),
        await roleMiddleware(req, res, {
          mandatoryRoles: [RoleEnum.DIRECTOR, RoleEnum.ADVISOR],
          forbiddenRoles: [RoleEnum.BANNED],
        }),
        await userController.list(req, res);
    });

    app.post<{ Body: CreateUserPayloadInterface }>(
      paths.user.create,
      async (req, res) => {
        await authMiddleware(
          req,
          res,
          repositoryResolver.getUserRepository(),
          tokenManager
        ),
          await roleMiddleware(req, res, {
            mandatoryRoles: [RoleEnum.DIRECTOR],
            forbiddenRoles: [RoleEnum.BANNED],
          }),
          await userController.create(req, res);
      }
    );

    app.put<{
      Params: RessourceParamsInterface;
      Body: UpdateUserPayloadInterface;
    }>(paths.user.update(), async (req, res) => {
      await authMiddleware(
        req,
        res,
        repositoryResolver.getUserRepository(),
        tokenManager
      ),
        await roleMiddleware(req, res, {
          mandatoryRoles: [RoleEnum.DIRECTOR],
          forbiddenRoles: [RoleEnum.BANNED],
        }),
        await userController.update(req, res);
    });

    app.delete<{ Params: RessourceParamsInterface }>(
      paths.user.delete(),
      async (req, res) => {
        await authMiddleware(
          req,
          res,
          repositoryResolver.getUserRepository(),
          tokenManager
        ),
          await roleMiddleware(req, res, {
            mandatoryRoles: [RoleEnum.DIRECTOR],
            forbiddenRoles: [RoleEnum.BANNED],
          }),
          await userController.delete(req, res);
      }
    );

    app.post<{ Params: RessourceParamsInterface }>(
      paths.user.ban(),
      async (req, res) => {
        await authMiddleware(
          req,
          res,
          repositoryResolver.getUserRepository(),
          tokenManager
        ),
          await roleMiddleware(req, res, {
            mandatoryRoles: [RoleEnum.DIRECTOR],
            forbiddenRoles: [RoleEnum.BANNED],
          }),
          await userController.ban(req, res);
      }
    );

    app.post<{ Params: RessourceParamsInterface }>(
      paths.user.unban(),
      async (req, res) => {
        await authMiddleware(
          req,
          res,
          repositoryResolver.getUserRepository(),
          tokenManager
        ),
          await roleMiddleware(req, res, {
            mandatoryRoles: [RoleEnum.DIRECTOR],
            forbiddenRoles: [RoleEnum.BANNED],
          }),
          await userController.unban(req, res);
      }
    );
  }
}
