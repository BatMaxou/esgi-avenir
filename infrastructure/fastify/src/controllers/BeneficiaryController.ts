import { FastifyReply, FastifyRequest } from "fastify";

import { MailerInterface } from "../../../../application/services/email/MailerInterface";
import { BeneficiaryRepositoryInterface } from "../../../../application/repositories/BeneficiaryRepositoryInterface";
import { CreateBeneficiaryCommand } from "../../../../application/commands/beneficiary/CreateBeneficiaryCommand";
import { InvalidCreateBeneficiaryCommandError } from "../../../../application/errors/commands/beneficiary/InvalidCreateBeneficiaryCommandError";
import { CreateBeneficiaryUsecase } from "../../../../application/usecases/beneficiary/CreateBeneficiaryUsecase";
import { UpdateBeneficiaryParams } from "../../../../application/params/beneficiary/UpdateBeneficiaryParams";
import { InvalidUpdateBeneficiaryCommandError } from "../../../../application/errors/commands/beneficiary/InvalidUpdateBeneficiaryCommandError";
import { UpdateBeneficiaryUsecase } from "../../../../application/usecases/beneficiary/UpdateBeneficiaryUsecase";
import { BeneficiaryNotFoundError } from "../../../../domain/errors/entities/beneficiary/BeneficiaryNotFoundError";
import { UpdateBeneficiaryCommand } from "../../../../application/commands/beneficiary/UpdateBeneficiaryCommand";
import { InvalidUpdateBeneficiaryParamsError } from "../../../../application/errors/params/beneficiary/InvalidUpdateBeneficiaryParamsError";
import { DeleteBeneficiaryParams } from "../../../../application/params/beneficiary/DeleteBeneficiaryParams";
import { InvalidDeleteBeneficiaryParamsError } from "../../../../application/errors/params/beneficiary/InvalidDeleteBeneficiaryParamsError";
import { DeleteBeneficiaryUsecase } from "../../../../application/usecases/beneficiary/DeleteBeneficiaryUsecase";
import { GetBeneficiaryListUsecase } from "../../../../application/usecases/beneficiary/GetBeneficiaryListUsecase";
import { AccountRepositoryInterface } from "../../../../application/repositories/AccountRepositoryInterface";
import { SendBeneficiaryCreationEmailUsecase } from "../../../../application/usecases/email/SendBeneficiaryCreationEmailUsecase";
import { BeneficiarySearchParams, GetBeneficiaryListQuery } from "../../../../application/queries/beneficiary/GetBeneficiaryListQuery";
import { InvalidGetListBeneficiaryQueryError } from "../../../../application/errors/queries/beneficiary/InvalidGetListBeneficiaryQueryError";
import { InvalidIbanError } from "../../../../domain/errors/values/iban/InvalidIbanError";
import { CreateBeneficiaryPayloadInterface, UpdateBeneficiaryPayloadInterface } from "../../../../application/services/api/resources/BeneficiaryResourceInterface";
import { RessourceParamsInterface } from "../../../../application/params/RessourceParamsInterface";

export class BeneficiaryController {
  public constructor(
    private readonly beneficiaryRepository: BeneficiaryRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly mailer: MailerInterface
  ) {}

  public async create(request: FastifyRequest<{Body: CreateBeneficiaryPayloadInterface}>, response: FastifyReply) {
    const maybeCommand = CreateBeneficiaryCommand.from(request.body);
    if (
      maybeCommand instanceof InvalidCreateBeneficiaryCommandError ||
      maybeCommand instanceof InvalidIbanError
    ) {
      return response.status(400).send({
        error: maybeCommand.message,
      });
    }

    const owner = request.user;
    if (!owner) {
      return response.status(401).send({
        error: "Unauthorized",
      });
    }

    const createUsecase = new CreateBeneficiaryUsecase(
      this.beneficiaryRepository,
      this.accountRepository
    );
    const maybeBeneficiary = await createUsecase.execute(
      maybeCommand.iban,
      owner,
      maybeCommand.name
    );

    if (maybeBeneficiary instanceof Error) {
      return response.status(400).send({
        error: maybeBeneficiary.message,
      });
    }

    const sendEmailUsecase = new SendBeneficiaryCreationEmailUsecase(
      this.mailer
    );
    await sendEmailUsecase.execute(maybeBeneficiary.name, owner.email);

    response.status(201).send({
      id: maybeBeneficiary.id,
      name: maybeBeneficiary.name,
    });
  }

  public async list(request: FastifyRequest<{Querystring: BeneficiarySearchParams}>, response: FastifyReply) {
    const maybeQuery = GetBeneficiaryListQuery.from(request.query);
    if (maybeQuery instanceof InvalidGetListBeneficiaryQueryError) {
      return response.status(400).send({
        error: maybeQuery.message,
      });
    }

    const owner = request.user;
    if (!owner) {
      return response.status(401).send({
        error: "Unauthorized",
      });
    }

    const getListUsecase = new GetBeneficiaryListUsecase(
      this.beneficiaryRepository
    );
    const beneficiaries = await getListUsecase.execute(
      owner,
      maybeQuery.term || ""
    );

    response.status(200).send(
      beneficiaries.map((beneficiary) => ({
        id: beneficiary.id,
        name: beneficiary.name,
        ownerId: beneficiary.ownerId,
        accountId: beneficiary.accountId,
        owner: beneficiary.owner
          ? {
              id: beneficiary.owner.id,
              firstName: beneficiary.owner.firstName,
              lastName: beneficiary.owner.lastName,
            }
          : null,
        account: beneficiary.account
          ? {
              id: beneficiary.account.id,
              iban: { value: beneficiary.account.iban },
            }
          : null,
      }))
    );
  }

  public async update(request: FastifyRequest<{Params: RessourceParamsInterface, Body: UpdateBeneficiaryPayloadInterface}>, response: FastifyReply) {
    const maybeParams = UpdateBeneficiaryParams.from(request.params);
    if (maybeParams instanceof InvalidUpdateBeneficiaryParamsError) {
      return response.status(400).send({
        error: maybeParams.message,
      });
    }

    const maybeCommand = UpdateBeneficiaryCommand.from(request.body);
    if (maybeCommand instanceof InvalidUpdateBeneficiaryCommandError) {
      return response.status(400).send({
        error: maybeCommand.message,
      });
    }

    const owner = request.user;
    if (!owner) {
      return response.status(401).send({
        error: "Unauthorized",
      });
    }

    const updateBeneficiaryUsecase = new UpdateBeneficiaryUsecase(
      this.beneficiaryRepository
    );
    const maybeBeneficiary = await updateBeneficiaryUsecase.execute(owner, {
      id: maybeParams.id,
      name: maybeCommand.name,
    });

    if (maybeBeneficiary instanceof BeneficiaryNotFoundError) {
      return response.status(404).send({
        error: maybeBeneficiary.message,
      });
    }

    if (maybeBeneficiary instanceof Error) {
      return response.status(400).send({
        error: maybeBeneficiary.message,
      });
    }

    response.status(200).send({
      id: maybeBeneficiary.id,
      name: maybeBeneficiary.name,
    });
  }

  public async delete(request: FastifyRequest<{Params: RessourceParamsInterface}>, response: FastifyReply) {
    const maybeParams = DeleteBeneficiaryParams.from(request.params);
    if (maybeParams instanceof InvalidDeleteBeneficiaryParamsError) {
      return response.status(400).send({
        error: maybeParams.message,
      });
    }

    const owner = request.user;
    if (!owner) {
      return response.status(401).send({
        error: "Unauthorized",
      });
    }

    const deleteBeneficiaryUsecase = new DeleteBeneficiaryUsecase(
      this.beneficiaryRepository
    );
    const maybeSuccess = await deleteBeneficiaryUsecase.execute(
      maybeParams.id,
      owner
    );

    if (maybeSuccess instanceof BeneficiaryNotFoundError) {
      return response.status(404).send({
        error: maybeSuccess.message,
      });
    }

    response.status(200).send({
      success: maybeSuccess,
    });
  }
}
