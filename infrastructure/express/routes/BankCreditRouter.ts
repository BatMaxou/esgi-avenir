import { Express } from "express";

import { paths } from "../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../application/services/RepositoryResolverInterface";
import { MailerInterface } from "../../../application/services/email/MailerInterface";
import { TokenManagerInterface } from "../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { BankCreditController } from "../controllers/BankCreditController";

export class BankCreditRouter {
  public register(
    app: Express,
    repositoryResolver: RepositoryResolverInterface,
    mailer: MailerInterface,
    tokenManager: TokenManagerInterface,
  ) {
    const bankCreditController = new BankCreditController(
      repositoryResolver.getUserRepository(),
      repositoryResolver.getAccountRepository(),
      repositoryResolver.getBankCreditRepository(),
      repositoryResolver.getMonthlyPaymentRepository(),
      repositoryResolver.getOperationRepository(),
      mailer,
    );

    app.post(
      paths.bankCredit.create,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [RoleEnum.ADVISOR], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await bankCreditController.create(req, res);
      }
    );

    app.get(
      paths.bankCredit.list,
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await bankCreditController.list(req, res);
      }
    );

    app.get(
      paths.bankCredit.payments(),
      authMiddleware(repositoryResolver.getUserRepository(), tokenManager),
      roleMiddleware({ mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] }),
      async (req, res) => {
        await bankCreditController.listPayments(req, res);
      }
    );
  }
}

