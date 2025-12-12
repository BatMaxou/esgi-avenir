import { FastifyInstance } from "fastify";

import { paths } from "../../../../application/services/api/paths";
import { RepositoryResolverInterface } from "../../../../application/services/RepositoryResolverInterface";
import { MailerInterface } from "../../../../application/services/email/MailerInterface";
import { TokenManagerInterface } from "../../../../application/services/token/TokenManagerInterface";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { BeneficiaryController } from "../controllers/BeneficiaryController";
import { CreateBeneficiaryPayloadInterface, UpdateBeneficiaryPayloadInterface } from "../../../../application/services/api/resources/BeneficiaryResourceInterface";
import { RessourceParamsInterface } from "../../../../application/params/RessourceParamsInterface";
import { BeneficiarySearchParams } from "../../../../application/queries/beneficiary/GetBeneficiaryListQuery";

export class BeneficiaryRouter {
  public register(
    app: FastifyInstance,
    repositoryResolver: RepositoryResolverInterface,
    mailer: MailerInterface,
    tokenManager: TokenManagerInterface,
  ) {
    const beneficiaryController = new BeneficiaryController(
      repositoryResolver.getBeneficiaryRepository(),
      repositoryResolver.getAccountRepository(),
      mailer
    );

    app.post<{Body: CreateBeneficiaryPayloadInterface}>(
      paths.beneficiary.create,
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await beneficiaryController.create(req, res);
      }
    );

    app.put<{Params: RessourceParamsInterface, Body: UpdateBeneficiaryPayloadInterface}>(
      paths.beneficiary.update(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await beneficiaryController.update(req, res);
      }
    );

    app.get<{Querystring: BeneficiarySearchParams}>(
      paths.beneficiary.list(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await beneficiaryController.list(req, res);
      }
    );

    app.delete<{Params: RessourceParamsInterface}>(
      paths.beneficiary.delete(),
      async (req, res) => {
        await authMiddleware(req, res, repositoryResolver.getUserRepository(), tokenManager);
        await roleMiddleware(req, res, { mandatoryRoles: [], forbiddenRoles: [RoleEnum.BANNED] });
        await beneficiaryController.delete(req, res);
      }
    );
  }
}

