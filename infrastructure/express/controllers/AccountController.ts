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

export class AccountController {
  public constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly mailer: MailerInterface,
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
        error: 'Unauthorized',
      });
    }

    const createUsecase = new CreateAccountUsecase(this.accountRepository, bankCode, branchCode);
    const maybeAccount = await createUsecase.execute(
      maybeCommand.name,
      owner,
    );

    if (maybeAccount instanceof Error) {
      return response.status(400).json({
        error: maybeAccount.message,
      });
    }

    const sendEmailUsecase = new SendAccountCreationEmailUsecase(this.mailer);
    await sendEmailUsecase.execute(
      owner.email,
    );

    response.status(201).json(maybeAccount);
  }

  public async list(request: Request, response: Response) {
    const owner = request.user;
    if (!owner) {
      return response.status(401).json({
        error: 'Unauthorized',
      });
    }
    
    const getAccountListUsecase = new GetAccountListUsecase(this.accountRepository);
    const accounts = await getAccountListUsecase.execute(owner);

    const accountsResponse = accounts.map((account) => ({
      id: account.id,
      name: account.name,
      iban: account.iban,
    }));

    response.status(200).json(accountsResponse);
  }

  // TODO: implement get when operation is ready
  //
  // public async get(request: Request, response: Response) {
  //   const maybeParams = GetUserParams.from(request.params);
  //   if (maybeParams instanceof InvalidGetUserParamsError) {
  //     return response.status(400).json({
  //       error: maybeParams.message,
  //     });
  //   }
  //
  //   const maybeUser = await this.userRepository.findById(maybeParams.id);
  //   if (maybeUser instanceof UserNotFoundError) {
  //     return response.status(404).json({
  //       error: maybeUser.message,
  //     });
  //   }
  //
  //   response.status(200).json({
  //     id: maybeUser.id,
  //     email: maybeUser.email.value,
  //     firstName: maybeUser.firstName,
  //     lastName: maybeUser.lastName,
  //     roles: maybeUser.roles,
  //   });
  // }

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
        error: 'Unauthorized',
      });
    }

    const updateAccountUsecase = new UpdateAccountUsecase(this.accountRepository);
    const maybeAccount = await updateAccountUsecase.execute(
      maybeParams.id,
      owner,
      {
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

    response.status(200).json(maybeAccount); 
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
        error: 'Unauthorized',
      });
    }

    const deleteAccountUsecase = new DeleteAccountUsecase(this.accountRepository);
    const maybeSuccess = await deleteAccountUsecase.execute(
      maybeParams.id,
      owner,
    );

    if (maybeSuccess instanceof AccountNotFoundError) {
      return response.status(404).json({
        error: maybeSuccess.message,
      });
    }

    const sendEmailUsecase = new SendAccountDeletionEmailUsecase(this.mailer);
    await sendEmailUsecase.execute(
      owner.email,
    );

    response.status(200).json({
      success: maybeSuccess,
    });
  }

  // public async ban(request: Request, response: Response) {
  //   const maybeParams = BanUserParams.from(request.params);
  //   if (maybeParams instanceof InvalidBanUserParamsError) {
  //     return response.status(400).json({
  //       error: maybeParams.message,
  //     });
  //   }
  //
  //   const banUserUsecase = new BanUserUsecase(this.userRepository);
  //   const maybeUser = await banUserUsecase.execute(maybeParams.id);
  //
  //   if (maybeUser instanceof UserNotFoundError) {
  //     return response.status(404).json({
  //       error: maybeUser.message,
  //     });
  //   }
  //
  //   response.status(200).json({
  //     id: maybeUser.id,
  //     email: maybeUser.email.value,
  //     firstName: maybeUser.firstName,
  //     lastName: maybeUser.lastName,
  //     roles: maybeUser.roles,
  //   }); 
  // }
  //
  // public async unban(request: Request, response: Response) {
  //   const maybeParams = UnbanUserParams.from(request.params);
  //   if (maybeParams instanceof InvalidUnbanUserParamsError) {
  //     return response.status(400).json({
  //       error: maybeParams.message,
  //     });
  //   }
  //
  //   const unbanUserUsecase = new UnbanUserUsecase(this.userRepository);
  //   const maybeUser = await unbanUserUsecase.execute(maybeParams.id);
  //
  //   if (maybeUser instanceof UserNotFoundError) {
  //     return response.status(404).json({
  //       error: maybeUser.message,
  //     });
  //   }
  //
  //   response.status(200).json({
  //     id: maybeUser.id,
  //     email: maybeUser.email.value,
  //     firstName: maybeUser.firstName,
  //     lastName: maybeUser.lastName,
  //     roles: maybeUser.roles,
  //   }); 
  // }
}

