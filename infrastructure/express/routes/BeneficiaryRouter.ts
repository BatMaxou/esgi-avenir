import { Express } from "express";

import { paths } from "../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../application/services/RepositoryResolverInterface";
import { MailerInterface } from "../../../application/services/email/MailerInterface";
import { TokenManagerInterface } from "../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { BeneficiaryController } from "../controllers/BeneficiaryController";

export class BeneficiaryRouter {
  public register(
    app: Express,
    repositoryResolver: RepositoryResolverInterface,
    mailer: MailerInterface,
    tokenManager: TokenManagerInterface,
  ) {
    const beneficiaryController = new BeneficiaryController(
      repositoryResolver.getBeneficiaryRepository(),
      repositoryResolver.getAccountRepository(),
      mailer
    );

    app.post(
      paths.beneficiary.create,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await beneficiaryController.create(req, res);
      }
    );

    app.put(
      paths.beneficiary.update(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await beneficiaryController.update(req, res);
      }
    );

    app.get(
      paths.beneficiary.list(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await beneficiaryController.list(req, res);
      }
    );

    app.delete(
      paths.beneficiary.delete(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await beneficiaryController.delete(req, res);
      }
    );
  }
}

