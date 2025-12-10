import { FastifyInstance } from "fastify";

import { paths } from "../../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../../application/services/RepositoryResolverInterface";
import { MailerInterface } from "../../../../application/services/email/MailerInterface";
import { TokenManagerInterface } from "../../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { BankCreditController } from "../controllers/BankCreditController";
import { CreateBankCreditPayloadInterface } from "../../../../application/services/api/resources/BankCreditResourceInterface";
import { RessourceParamsInterface } from "../../../../application/params/RessourceParamsInterface";

export class BankCreditRouter {
  public register(
    app: FastifyInstance,
    repositoryResolver: RepositoryResolverInterface,
    mailer: MailerInterface,
    tokenManager: TokenManagerInterface,
  ) {
    const bankCreditController = new BankCreditController(
      repositoryResolver.getUserRepository(),
      repositoryResolver.getAccountRepository(),
      repositoryResolver.getBankCreditRepository(),
      repositoryResolver.getMonthlyPaymentRepository(),
      mailer,
    );

    app.post<{Body: CreateBankCreditPayloadInterface}>(
      paths.bankCredit.create,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [RoleEnum.ADVISOR], forbiddenRoles: [RoleEnum.BANNED] });
        await bankCreditController.create(req, res);
      }
    );

    app.get(
      paths.bankCredit.list,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await bankCreditController.list(req, res);
      }
    );

    app.get<{Params: RessourceParamsInterface}>(
      paths.bankCredit.payments(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await bankCreditController.listPayments(req, res);
      }
    );
  }
}

