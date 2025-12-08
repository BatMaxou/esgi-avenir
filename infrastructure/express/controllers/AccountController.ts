import { Request, Response } from "express";

import { bankCode, branchCode } from "../utils/tools";
import { MailerInterface } from "../../../application/services/email/MailerInterface";
import { AccountRepositoryInterface } from "../../../application/repositories/AccountRepositoryInterface";
import { CreateAccountCommand } from "../../../domain/commands/account/CreateAccountCommand";
import { InvalidCreateAccountCommandError } from "../../../domain/errors/commands/account/InvalidCreateAccountCommandError";
import { CreateAccountUsecase } from "../../../application/usecases/account/CreateAccountUsecase";
import { SendAccountCreationEmailUsecase } from "../../../application/usecases/email/SendAccountCreationEmailUsecase";
import { UpdateAccountParams } from "../../../domain/params/account/UpdateAccountParams";
import { InvalidUpdateAccountCommandError } from "../../../domain/errors/commands/account/InvalidUpdateAccountCommandError";
import { UpdateAccountUsecase } from "../../../application/usecases/account/UpdateAccountUsecase";
import { AccountNotFoundError } from "../../../domain/errors/entities/account/AccountNotFoundError";
import { UpdateAccountCommand } from "../../../domain/commands/account/UpdateAccountCommand";
import { InvalidUpdateAccountParamsError } from "../../../domain/errors/params/account/InvalidUpdateAccountParamsError";
import { DeleteAccountParams } from "../../../domain/params/account/DeleteAccountParams";
import { InvalidDeleteAccountParamsError } from "../../../domain/errors/params/account/InvalidDeleteAccountParamsError";
import { DeleteAccountUsecase } from "../../../application/usecases/account/DeleteAccountUsecase";
import { SendAccountDeletionEmailUsecase } from "../../../application/usecases/email/SendAccountDeletionEmailUsecase";
import { GetAccountListUsecase } from "../../../application/usecases/account/GetAccountListUsecase";
import { OperationRepositoryInterface } from "../../../application/repositories/OperationRepositoryInterface";
import { GetAccountParams } from "../../../domain/params/account/GetAccountParams";
import { InvalidGetAccountParamsError } from "../../../domain/errors/params/account/InvalidGetAccountParamsError";
import { GetAccountUsecase } from "../../../application/usecases/account/GetAccountUsecase";
import { GetAccountOperationsParams } from "../../../domain/params/account/GetAccountOperationsParams";
import { InvalidGetAccountOperationsParamsError } from "../../../domain/errors/params/account/InvalidGetAccountOperationsParamsError";
import { GetOperationListUsecase } from "../../../application/usecases/operation/GetOperationListUsecase";
import { BeneficiaryRepositoryInterface } from "../../../application/repositories/BeneficiaryRepositoryInterface";
import { AccountNotSoldableError } from "../../../application/errors/account/AccountNotSoldableError";

export class AccountController {
  public constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly operationRepository: OperationRepositoryInterface,
    private readonly beneficiaryRepository: BeneficiaryRepositoryInterface,
    private readonly mailer: MailerInterface
  ) {}

  public async create(request: Request, response: Response) {
    const maybeCommand = CreateAccountCommand.from(request.body);
    if (maybeCommand instanceof InvalidCreateAccountCommandError) {
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

    const createUsecase = new CreateAccountUsecase(
      this.accountRepository,
      bankCode,
      branchCode
    );
    const maybeAccount = await createUsecase.execute(maybeCommand.name, owner);

    if (maybeAccount instanceof Error) {
      return response.status(400).json({
        error: maybeAccount.message,
      });
    }

    const sendEmailUsecase = new SendAccountCreationEmailUsecase(this.mailer);
    await sendEmailUsecase.execute(owner.email);

    response.status(201).json({
      id: maybeAccount.id,
      name: maybeAccount.name,
      iban: maybeAccount.iban,
      isSavings: maybeAccount.isSavings,
      amount: 0,
    });
  }

  public async createSavings(request: Request, response: Response) {
    const maybeCommand = CreateAccountCommand.from(request.body);
    if (maybeCommand instanceof InvalidCreateAccountCommandError) {
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

    const createUsecase = new CreateAccountUsecase(
      this.accountRepository,
      bankCode,
      branchCode
    );
    const maybeAccount = await createUsecase.execute(
      maybeCommand.name,
      owner,
      true
    );

    if (maybeAccount instanceof Error) {
      return response.status(400).json({
        error: maybeAccount.message,
      });
    }

    const sendEmailUsecase = new SendAccountCreationEmailUsecase(this.mailer);
    await sendEmailUsecase.execute(owner.email);

    response.status(201).json({
      id: maybeAccount.id,
      name: maybeAccount.name,
      iban: maybeAccount.iban,
      isSavings: maybeAccount.isSavings,
      amount: 0,
    });
  }

  public async list(request: Request, response: Response) {
    const owner = request.user;
    if (!owner) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    }

    const getAccountListUsecase = new GetAccountListUsecase(
      this.accountRepository,
      this.operationRepository
    );
    const accounts = await getAccountListUsecase.execute(owner);

    const accountsResponse = accounts.map((account) => ({
      id: account.id,
      name: account.name,
      iban: account.iban,
      isSavings: account.isSavings,
      amount: account.amount,
    }));

    response.status(200).json(accountsResponse);
  }

  public async get(request: Request, response: Response) {
    const maybeParams = GetAccountParams.from(request.params);
    if (maybeParams instanceof InvalidGetAccountParamsError) {
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

    const getAccountUsecase = new GetAccountUsecase(
      this.accountRepository,
      this.operationRepository
    );
    const maybeAccount = await getAccountUsecase.execute(maybeParams.id, owner);
    if (maybeAccount instanceof AccountNotFoundError) {
      return response.status(404).json({
        error: maybeAccount.message,
      });
    }

    response.status(200).json({
      id: maybeAccount.id,
      name: maybeAccount.name,
      owner: maybeAccount.owner,
      ownerId: maybeAccount.ownerId,
      iban: maybeAccount.iban,
      isSavings: maybeAccount.isSavings,
      amount: maybeAccount.amount,
    });
  }

  public async update(request: Request, response: Response) {
    const maybeParams = UpdateAccountParams.from(request.params);
    if (maybeParams instanceof InvalidUpdateAccountParamsError) {
      return response.status(400).json({
        error: maybeParams.message,
      });
    }

    const maybeCommand = UpdateAccountCommand.from(request.body);
    if (maybeCommand instanceof InvalidUpdateAccountCommandError) {
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

    const updateAccountUsecase = new UpdateAccountUsecase(
      this.accountRepository
    );
    const maybeAccount = await updateAccountUsecase.execute(
      owner,
      {
        id: maybeParams.id,
        name: maybeCommand.name,
      }
    );

    if (maybeAccount instanceof AccountNotFoundError) {
      return response.status(404).json({
        error: maybeAccount.message,
      });
    }

    if (maybeAccount instanceof Error) {
      return response.status(400).json({
        error: maybeAccount.message,
      });
    }

    response.status(200).json({
      id: maybeAccount.id,
      name: maybeAccount.name,
      iban: maybeAccount.iban,
      isSavings: maybeAccount.isSavings,
    });
  }

  public async delete(request: Request, response: Response) {
    const maybeParams = DeleteAccountParams.from(request.params);
    if (maybeParams instanceof InvalidDeleteAccountParamsError) {
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

    const deleteAccountUsecase = new DeleteAccountUsecase(
      this.accountRepository,
      this.operationRepository,
    );
    const maybeSuccess = await deleteAccountUsecase.execute(
      maybeParams.id,
      owner
    );

    if (maybeSuccess instanceof AccountNotFoundError) {
      return response.status(404).json({
        error: maybeSuccess.message,
      });
    }

    if (maybeSuccess instanceof AccountNotSoldableError) {
      return response.status(400).json({
        error: maybeSuccess.message,
      });
    }

    const sendEmailUsecase = new SendAccountDeletionEmailUsecase(this.mailer);
    await sendEmailUsecase.execute(owner.email);

    response.status(200).json({
      success: maybeSuccess,
    });
  }

  public async listOperations(request: Request, response: Response) {
    const maybeParams = GetAccountOperationsParams.from(request.params);
    if (maybeParams instanceof InvalidGetAccountOperationsParamsError) {
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

    const getListUsecase = new GetOperationListUsecase(
      this.accountRepository,
      this.operationRepository,
      this.beneficiaryRepository,
    );
    const operations = await getListUsecase.execute(maybeParams.id, owner);

    if (operations instanceof AccountNotFoundError) {
      return response.status(404).json({
        error: operations.message,
      });
    }

    response.status(200).json(operations);
  }
}
