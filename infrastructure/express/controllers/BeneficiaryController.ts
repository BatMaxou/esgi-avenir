import { Request, Response } from "express";

import { MailerInterface } from "../../../application/services/email/MailerInterface";
import { BeneficiaryRepositoryInterface } from "../../../application/repositories/BeneficiaryRepositoryInterface";
import { CreateBeneficiaryCommand } from "../../../domain/commands/beneficiary/CreateBeneficiaryCommand";
import { InvalidCreateBeneficiaryCommandError } from "../../../domain/errors/commands/beneficiary/InvalidCreateBeneficiaryCommandError";
import { CreateBeneficiaryUsecase } from "../../../application/usecases/beneficiary/CreateBeneficiaryUsecase";
import { UpdateBeneficiaryParams } from "../../../domain/params/beneficiary/UpdateBeneficiaryParams";
import { InvalidUpdateBeneficiaryCommandError } from "../../../domain/errors/commands/beneficiary/InvalidUpdateBeneficiaryCommandError";
import { UpdateBeneficiaryUsecase } from "../../../application/usecases/beneficiary/UpdateBeneficiaryUsecase";
import { BeneficiaryNotFoundError } from "../../../domain/errors/entities/beneficiary/BeneficiaryNotFoundError";
import { UpdateBeneficiaryCommand } from "../../../domain/commands/beneficiary/UpdateBeneficiaryCommand";
import { InvalidUpdateBeneficiaryParamsError } from "../../../domain/errors/params/beneficiary/InvalidUpdateBeneficiaryParamsError";
import { DeleteBeneficiaryParams } from "../../../domain/params/beneficiary/DeleteBeneficiaryParams";
import { InvalidDeleteBeneficiaryParamsError } from "../../../domain/errors/params/beneficiary/InvalidDeleteBeneficiaryParamsError";
import { DeleteBeneficiaryUsecase } from "../../../application/usecases/beneficiary/DeleteBeneficiaryUsecase";
import { GetBeneficiaryListUsecase } from "../../../application/usecases/beneficiary/GetBeneficiaryListUsecase";
import { AccountRepositoryInterface } from "../../../application/repositories/AccountRepositoryInterface";
import { SendBeneficiaryCreationEmailUsecase } from "../../../application/usecases/email/SendBeneficiaryCreationEmailUsecase";
import { GetBeneficiaryListQuery } from "../../../domain/queries/beneficiary/GetBeneficiaryListQuery";
import { InvalidGetListBeneficiaryQueryError } from "../../../domain/errors/queries/beneficiary/InvalidGetListBeneficiaryQueryError";
import { InvalidIbanError } from "../../../domain/errors/values/iban/InvalidIbanError";

export class BeneficiaryController {
  public constructor(
    private readonly beneficiaryRepository: BeneficiaryRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly mailer: MailerInterface
  ) {}

  public async create(request: Request, response: Response) {
    const maybeCommand = CreateBeneficiaryCommand.from(request.body);
    if (
      maybeCommand instanceof InvalidCreateBeneficiaryCommandError
      || maybeCommand instanceof InvalidIbanError
    ) {
      return response.status(400).json({
        error: maybeCommand.message,
      });
    }

    const owner = request.user;
    if (!owner) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    }

    const createUsecase = new CreateBeneficiaryUsecase(this.beneficiaryRepository, this.accountRepository);
    const maybeBeneficiary = await createUsecase.execute(maybeCommand.iban, owner, maybeCommand.name);

    if (maybeBeneficiary instanceof Error) {
      return response.status(400).json({
        error: maybeBeneficiary.message,
      });
    }

    const sendEmailUsecase = new SendBeneficiaryCreationEmailUsecase(this.mailer);
    await sendEmailUsecase.execute(maybeBeneficiary.name, owner.email);

    response.status(201).json({
      id: maybeBeneficiary.id,
      name: maybeBeneficiary.name,
    });
  }

  public async list(request: Request, response: Response) {
    const maybeQuery = GetBeneficiaryListQuery.from(request.query);
    if (maybeQuery instanceof InvalidGetListBeneficiaryQueryError) {
      return response.status(400).json({
        error: maybeQuery.message,
      });
    }

    const owner = request.user;
    if (!owner) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    }

    const getListUsecase = new GetBeneficiaryListUsecase(this.beneficiaryRepository);
    const beneficiaries = await getListUsecase.execute(owner, maybeQuery.term || '');

    response.status(200).json(beneficiaries.map((beneficiary) => ({
      id: beneficiary.id,
      name: beneficiary.name,
    })));
  }

  public async update(request: Request, response: Response) {
    const maybeParams = UpdateBeneficiaryParams.from(request.params);
    if (maybeParams instanceof InvalidUpdateBeneficiaryParamsError) {
      return response.status(400).json({
        error: maybeParams.message,
      });
    }

    const maybeCommand = UpdateBeneficiaryCommand.from(request.body);
    if (maybeCommand instanceof InvalidUpdateBeneficiaryCommandError) {
      return response.status(400).json({
        error: maybeCommand.message,
      });
    }

    const owner = request.user;
    if (!owner) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    }

    const updateBeneficiaryUsecase = new UpdateBeneficiaryUsecase(this.beneficiaryRepository);
    const maybeBeneficiary = await updateBeneficiaryUsecase.execute(
      owner,
      {
        id: maybeParams.id,
        name: maybeCommand.name,
      }
    );

    if (maybeBeneficiary instanceof BeneficiaryNotFoundError) {
      return response.status(404).json({
        error: maybeBeneficiary.message,
      });
    }

    if (maybeBeneficiary instanceof Error) {
      return response.status(400).json({
        error: maybeBeneficiary.message,
      });
    }

    response.status(200).json({
      id: maybeBeneficiary.id,
      name: maybeBeneficiary.name,
    });
  }

  public async delete(request: Request, response: Response) {
    const maybeParams = DeleteBeneficiaryParams.from(request.params);
    if (maybeParams instanceof InvalidDeleteBeneficiaryParamsError) {
      return response.status(400).json({
        error: maybeParams.message,
      });
    }

    const owner = request.user;
    if (!owner) {
      return response.status(401).json({
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
      return response.status(404).json({
        error: maybeSuccess.message,
      });
    }

    response.status(200).json({
      success: maybeSuccess,
    });
  }
}
