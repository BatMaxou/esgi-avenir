import { FastifyRequest, FastifyReply } from "fastify";

import { bankCode, branchCode } from "../utils/tools";
import { MailerInterface } from "../../../../application/services/email/MailerInterface";
import { AccountRepositoryInterface } from "../../../../application/repositories/AccountRepositoryInterface";
import { CreateAccountCommand } from "../../../../application/commands/account/CreateAccountCommand";
import { InvalidCreateAccountCommandError } from "../../../../application/errors/commands/account/InvalidCreateAccountCommandError";
import { CreateAccountUsecase } from "../../../../application/usecases/account/CreateAccountUsecase";
import { SendAccountCreationEmailUsecase } from "../../../../application/usecases/email/SendAccountCreationEmailUsecase";
import { UpdateAccountParams } from "../../../../application/params/account/UpdateAccountParams";
import { InvalidUpdateAccountCommandError } from "../../../../application/errors/commands/account/InvalidUpdateAccountCommandError";
import { UpdateAccountUsecase } from "../../../../application/usecases/account/UpdateAccountUsecase";
import { AccountNotFoundError } from "../../../../domain/errors/entities/account/AccountNotFoundError";
import { UpdateAccountCommand } from "../../../../application/commands/account/UpdateAccountCommand";
import { InvalidUpdateAccountParamsError } from "../../../../application/errors/params/account/InvalidUpdateAccountParamsError";
import { DeleteAccountParams } from "../../../../application/params/account/DeleteAccountParams";
import { InvalidDeleteAccountParamsError } from "../../../../application/errors/params/account/InvalidDeleteAccountParamsError";
import { DeleteAccountUsecase } from "../../../../application/usecases/account/DeleteAccountUsecase";
import { SendAccountDeletionEmailUsecase } from "../../../../application/usecases/email/SendAccountDeletionEmailUsecase";
import { GetAccountListUsecase } from "../../../../application/usecases/account/GetAccountListUsecase";
import { OperationRepositoryInterface } from "../../../../application/repositories/OperationRepositoryInterface";
import { GetAccountParams } from "../../../../application/params/account/GetAccountParams";
import { InvalidGetAccountParamsError } from "../../../../application/errors/params/account/InvalidGetAccountParamsError";
import { GetAccountUsecase } from "../../../../application/usecases/account/GetAccountUsecase";
import { GetAccountOperationsParams } from "../../../../application/params/account/GetAccountOperationsParams";
import { InvalidGetAccountOperationsParamsError } from "../../../../application/errors/params/account/InvalidGetAccountOperationsParamsError";
import { GetOperationListUsecase } from "../../../../application/usecases/operation/GetOperationListUsecase";
import { BeneficiaryRepositoryInterface } from "../../../../application/repositories/BeneficiaryRepositoryInterface";
import { AccountNotSoldableError } from "../../../../application/errors/account/AccountNotSoldableError";
import { CreateAccountPayloadInterface, UpdateAccountPayloadInterface } from "../../../../application/services/api/resources/AccountResourceInterface";
import { RessourceParamsInterface } from "../../../../application/params/RessourceParamsInterface";
import { GetAccountListByUserQuery, GetAccountListByUserSearchParams } from "../../../../application/queries/account/GetAccountListByUserQuery";
import { InvalidGetAccountListByUserQueryError } from "../../../../application/errors/queries/account/InvalidGetAccountListByUserQueryError";
import { GetAccountListByUserUsecase } from "../../../../application/usecases/account/GetAccountListByUserUsecase";


export class AccountController {
  public constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly operationRepository: OperationRepositoryInterface,
    private readonly beneficiaryRepository: BeneficiaryRepositoryInterface,
    private readonly mailer: MailerInterface
  ) {}

  public async create(request: FastifyRequest<{Body: CreateAccountPayloadInterface}>, response: FastifyReply) {
    const maybeCommand = CreateAccountCommand.from(request.body);
    if (maybeCommand instanceof InvalidCreateAccountCommandError) {
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

    const createUsecase = new CreateAccountUsecase(
      this.accountRepository,
      bankCode,
      branchCode
    );
    const maybeAccount = await createUsecase.execute(maybeCommand.name, owner);

    if (maybeAccount instanceof Error) {
      return response.status(400).send({
        error: maybeAccount.message,
      });
    }

    const sendEmailUsecase = new SendAccountCreationEmailUsecase(this.mailer);
    await sendEmailUsecase.execute(owner.email);

    response.status(201).send({
      id: maybeAccount.id,
      name: maybeAccount.name,
      iban: maybeAccount.iban,
      isSavings: maybeAccount.isSavings,
      amount: 0,
    });
  }

  public async createSavings(request: FastifyRequest<{Body: CreateAccountPayloadInterface}>, response: FastifyReply) {
    const maybeCommand = CreateAccountCommand.from(request.body);
    if (maybeCommand instanceof InvalidCreateAccountCommandError) {
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
      return response.status(400).send({
        error: maybeAccount.message,
      });
    }

    const sendEmailUsecase = new SendAccountCreationEmailUsecase(this.mailer);
    await sendEmailUsecase.execute(owner.email);

    response.status(201).send({
      id: maybeAccount.id,
      name: maybeAccount.name,
      iban: maybeAccount.iban,
      isSavings: maybeAccount.isSavings,
      amount: 0,
    });
  }

  public async list(request: FastifyRequest, response: FastifyReply) {
    const owner = request.user;
    if (!owner) {
      return response.status(401).send({
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

    response.status(200).send(accountsResponse);
  }

  public async get(request: FastifyRequest<{Params: RessourceParamsInterface}>, response: FastifyReply) {
    const maybeParams = GetAccountParams.from(request.params);
    if (maybeParams instanceof InvalidGetAccountParamsError) {
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

    const getAccountUsecase = new GetAccountUsecase(
      this.accountRepository,
      this.operationRepository
    );
    const maybeAccount = await getAccountUsecase.execute(maybeParams.id, owner);
    if (maybeAccount instanceof AccountNotFoundError) {
      return response.status(404).send({
        error: maybeAccount.message,
      });
    }

    response.status(200).send({
      id: maybeAccount.id,
      name: maybeAccount.name,
      owner: maybeAccount.owner,
      ownerId: maybeAccount.ownerId,
      iban: maybeAccount.iban,
      isSavings: maybeAccount.isSavings,
      amount: maybeAccount.amount,
    });
  }

  public async update(request: FastifyRequest<{Params: RessourceParamsInterface, Body: UpdateAccountPayloadInterface}>, response: FastifyReply) {
    const maybeParams = UpdateAccountParams.from(request.params);
    if (maybeParams instanceof InvalidUpdateAccountParamsError) {
      return response.status(400).send({
        error: maybeParams.message,
      });
    }

    const maybeCommand = UpdateAccountCommand.from(request.body);
    if (maybeCommand instanceof InvalidUpdateAccountCommandError) {
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
      return response.status(404).send({
        error: maybeAccount.message,
      });
    }

    if (maybeAccount instanceof Error) {
      return response.status(400).send({
        error: maybeAccount.message,
      });
    }

    response.status(200).send({
      id: maybeAccount.id,
      name: maybeAccount.name,
      iban: maybeAccount.iban,
      isSavings: maybeAccount.isSavings,
    });
  }

  public async delete(request: FastifyRequest<{Params: RessourceParamsInterface}>, response: FastifyReply) {
    const maybeParams = DeleteAccountParams.from(request.params);
    if (maybeParams instanceof InvalidDeleteAccountParamsError) {
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

    const deleteAccountUsecase = new DeleteAccountUsecase(
      this.accountRepository,
      this.beneficiaryRepository,
      this.operationRepository,
    );
    const maybeSuccess = await deleteAccountUsecase.execute(
      maybeParams.id,
      owner
    );

    if (maybeSuccess instanceof AccountNotFoundError) {
      return response.status(404).send({
        error: maybeSuccess.message,
      });
    }

    if (maybeSuccess instanceof AccountNotSoldableError) {
      return response.status(400).send({
        error: maybeSuccess.message,
      });
    }

    const sendEmailUsecase = new SendAccountDeletionEmailUsecase(this.mailer);
    await sendEmailUsecase.execute(owner.email);

    response.status(200).send({
      success: maybeSuccess,
    });
  }

  public async listOperations(request: FastifyRequest<{Params: RessourceParamsInterface}>, response: FastifyReply) {
    const maybeParams = GetAccountOperationsParams.from(request.params);
    if (maybeParams instanceof InvalidGetAccountOperationsParamsError) {
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

    const getListUsecase = new GetOperationListUsecase(
      this.accountRepository,
      this.operationRepository,
      this.beneficiaryRepository,
    );
    const operations = await getListUsecase.execute(maybeParams.id, owner);

    if (operations instanceof AccountNotFoundError) {
      return response.status(404).send({
        error: operations.message,
      });
    }

    response.status(200).send(operations);
  }

  public async listByUser(request: FastifyRequest<{Querystring: GetAccountListByUserSearchParams}>, response: FastifyReply) {
    const maybeQuery = GetAccountListByUserQuery.from(request.query);
    if (maybeQuery instanceof InvalidGetAccountListByUserQueryError) {
      return response.status(400).send({
        error: maybeQuery.message,
      });
    }

    const getAccountListUsecase = new GetAccountListByUserUsecase(
      this.accountRepository,
      this.operationRepository
    );
    const accounts = await getAccountListUsecase.execute(
      maybeQuery.firstName || '',
      maybeQuery.lastName || '',
    );

    const accountsResponse = accounts.map((account) => ({
      id: account.id,
      name: account.name,
      iban: account.iban,
      isSavings: account.isSavings,
      amount: account.amount,
      ...(account.owner ? {
        owner: {
          id: account.owner.id,
          firstName: account.owner.firstName,
          lastName: account.owner.lastName,
          email: account.owner.email,
        }
      } : {})
    }));

    response.status(200).send(accountsResponse);
  }
}
