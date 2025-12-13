import { Request, Response } from "express";

import { UserRepositoryInterface } from "../../../application/repositories/UserRepositoryInterface";
import { EmailValue } from "../../../domain/values/EmailValue";
import { InvalidEmailError } from "../../../domain/errors/values/email/InvalidEmailError";
import { PasswordValue } from "../../../domain/values/PasswordValue";
import { InvalidPasswordError } from "../../../domain/errors/values/password/InvalidPasswordError";
import { PasswordHasherInterface } from "../../../application/services/password/PasswordHasherInterface";
import { UniqueIdGeneratorInterface } from "../../../application/services/uid/UniqueIdGeneratorInterface";
import { CreateUserUsecase } from "../../../application/usecases/user/CreateUserUsecase";
import { CreateUserCommand } from "../../../application/commands/user/CreateUserCommand";
import { InvalidCreateUserCommandError } from "../../../application/errors/commands/user/InvalidCreateUserCommandError";
import { UpdateUserCommand } from "../../../application/commands/user/UpdateUserCommand";
import { InvalidUpdateUserCommandError } from "../../../application/errors/commands/user/InvalidUpdateUserCommandError";
import { UpdateUserUsecase } from "../../../application/usecases/user/UpdateUserUsecase";
import { UpdateUserParams } from "../../../application/params/user/UpdateUserParams";
import { SendConfirmationEmailUsecase } from "../../../application/usecases/email/SendConfirmationEmailUsecase";
import { frontUrl } from "../utils/tools";
import { MailerInterface } from "../../../application/services/email/MailerInterface";
import { InvalidUpdateUserParamsError } from "../../../application/errors/params/user/InvalidUpdateUserParamsError";
import { DeleteUserParams } from "../../../application/params/user/DeleteUserParams";
import { InvalidDeleteUserParamsError } from "../../../application/errors/params/user/InvalidDeleteUserParamsError";
import { GetUserParams } from "../../../application/params/user/GetUserParams";
import { InvalidGetUserParamsError } from "../../../application/errors/params/user/InvalidGetUserParamsError";
import { UnbanUserParams } from "../../../application/params/user/UnbanUserParams";
import { InvalidUnbanUserParamsError } from "../../../application/errors/params/user/InvalidUnbanUserParamsError";
import { UnbanUserUsecase } from "../../../application/usecases/user/UnbanUserUsecase";
import { DeleteUserUsecase } from "../../../application/usecases/user/DeleteUserUsecase";
import { BanUserParams } from "../../../application/params/user/BanUserParams";
import { InvalidBanUserParamsError } from "../../../application/errors/params/user/InvalidBanUserParamsError";
import { BanUserUsecase } from "../../../application/usecases/user/BanUserUsecase";
import { UserNotFoundError } from "../../../domain/errors/entities/user/UserNotFoundError";
import { GetUserListUsecase } from "../../../application/usecases/user/GetUserListUsecase";
import { GetUserUsecase } from "../../../application/usecases/user/GetUserUsecase";

export class UserController {
  public constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly passwordHasher: PasswordHasherInterface,
    private readonly uniqueIdGenerator: UniqueIdGeneratorInterface,
    private readonly mailer: MailerInterface
  ) {}

  public async create(request: Request, response: Response) {
    const maybeCommand = CreateUserCommand.from(request.body);
    if (maybeCommand instanceof InvalidCreateUserCommandError) {
      return response.status(400).json({
        error: maybeCommand.message,
      });
    }

    const maybeEmail = EmailValue.from(maybeCommand.email);
    if (maybeEmail instanceof InvalidEmailError) {
      return response.status(400).json({
        error: maybeEmail.message,
      });
    }

    const maybePassword = PasswordValue.from(maybeCommand.password);
    if (maybePassword instanceof InvalidPasswordError) {
      return response.status(400).json({
        error: maybePassword.message,
      });
    }

    const createUsecase = new CreateUserUsecase(
      this.userRepository,
      this.passwordHasher,
      this.uniqueIdGenerator
    );
    const maybeUser = await createUsecase.execute(
      maybeEmail.value,
      maybePassword.value,
      maybeCommand.firstName,
      maybeCommand.lastName,
      maybeCommand.roles
    );

    if (maybeUser instanceof Error) {
      return response.status(400).json({
        error: maybeUser.message,
      });
    }

    const sendEmailUsecase = new SendConfirmationEmailUsecase(this.mailer);
    await sendEmailUsecase.execute(
      maybeEmail,
      `${frontUrl}/confirm?token=${maybeUser.confirmationToken}`
    );

    response.status(201).json({
      id: maybeUser.id,
      email: maybeUser.email.value,
      firstName: maybeUser.firstName,
      lastName: maybeUser.lastName,
      roles: maybeUser.roles,
    });
  }

  public async list(_: Request, response: Response) {
    const getListUsecase = new GetUserListUsecase(this.userRepository);
    const users = await getListUsecase.execute();

    const usersResponse = users.map((user) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
    }));

    response.status(200).json(usersResponse);
  }

  public async get(request: Request, response: Response) {
    const maybeParams = GetUserParams.from(request.params);
    if (maybeParams instanceof InvalidGetUserParamsError) {
      return response.status(400).json({
        error: maybeParams.message,
      });
    }

    const getUserUsecase = new GetUserUsecase(this.userRepository);
    const maybeUser = await getUserUsecase.execute(maybeParams.id);
    if (maybeUser instanceof UserNotFoundError) {
      return response.status(404).json({
        error: maybeUser.message,
      });
    }

    response.status(200).json({
      id: maybeUser.id,
      email: maybeUser.email,
      firstName: maybeUser.firstName,
      lastName: maybeUser.lastName,
      roles: maybeUser.roles,
    });
  }

  public async update(request: Request, response: Response) {
    const maybeParams = UpdateUserParams.from(request.params);
    if (maybeParams instanceof InvalidUpdateUserParamsError) {
      return response.status(400).json({
        error: maybeParams.message,
      });
    }

    const maybeCommand = UpdateUserCommand.from(request.body);
    if (maybeCommand instanceof InvalidUpdateUserCommandError) {
      return response.status(400).json({
        error: maybeCommand.message,
      });
    }

    const maybeEmail = maybeCommand.email
      ? EmailValue.from(maybeCommand.email)
      : undefined;
    if (maybeEmail instanceof InvalidEmailError) {
      return response.status(400).json({
        error: maybeEmail.message,
      });
    }

    const maybePassword = maybeCommand.password
      ? PasswordValue.from(maybeCommand.password)
      : undefined;
    if (maybePassword instanceof InvalidPasswordError) {
      return response.status(400).json({
        error: maybePassword.message,
      });
    }

    const updateUserUsecase = new UpdateUserUsecase(
      this.userRepository,
      this.passwordHasher
    );
    const maybeUser = await updateUserUsecase.execute({
      id: maybeParams.id,
      email: maybeEmail,
      password: maybePassword,
      firstName: maybeCommand.firstName,
      lastName: maybeCommand.lastName,
      roles: maybeCommand.roles,
    });

    if (maybeUser instanceof UserNotFoundError) {
      return response.status(404).json({
        error: maybeUser.message,
      });
    }

    if (maybeUser instanceof Error) {
      return response.status(400).json({
        error: maybeUser.message,
      });
    }

    response.status(200).json({
      id: maybeUser.id,
      email: maybeUser.email.value,
      firstName: maybeUser.firstName,
      lastName: maybeUser.lastName,
      roles: maybeUser.roles,
    });
  }

  public async delete(request: Request, response: Response) {
    const maybeParams = DeleteUserParams.from(request.params);
    if (maybeParams instanceof InvalidDeleteUserParamsError) {
      return response.status(400).json({
        error: maybeParams.message,
      });
    }

    const deleteUserUsecase = new DeleteUserUsecase(this.userRepository);
    const maybeSuccess = await deleteUserUsecase.execute(maybeParams.id);

    if (maybeSuccess instanceof UserNotFoundError) {
      return response.status(404).json({
        error: maybeSuccess.message,
      });
    }

    response.status(200).json({
      success: maybeSuccess,
    });
  }

  public async ban(request: Request, response: Response) {
    const maybeParams = BanUserParams.from(request.params);
    if (maybeParams instanceof InvalidBanUserParamsError) {
      return response.status(400).json({
        error: maybeParams.message,
      });
    }

    const banUserUsecase = new BanUserUsecase(this.userRepository);
    const maybeUser = await banUserUsecase.execute(maybeParams.id);

    if (maybeUser instanceof UserNotFoundError) {
      return response.status(404).json({
        error: maybeUser.message,
      });
    }

    response.status(200).json({
      id: maybeUser.id,
      email: maybeUser.email.value,
      firstName: maybeUser.firstName,
      lastName: maybeUser.lastName,
      roles: maybeUser.roles,
    });
  }

  public async unban(request: Request, response: Response) {
    const maybeParams = UnbanUserParams.from(request.params);
    if (maybeParams instanceof InvalidUnbanUserParamsError) {
      return response.status(400).json({
        error: maybeParams.message,
      });
    }

    const unbanUserUsecase = new UnbanUserUsecase(this.userRepository);
    const maybeUser = await unbanUserUsecase.execute(maybeParams.id);

    if (maybeUser instanceof UserNotFoundError) {
      return response.status(404).json({
        error: maybeUser.message,
      });
    }

    response.status(200).json({
      id: maybeUser.id,
      email: maybeUser.email.value,
      firstName: maybeUser.firstName,
      lastName: maybeUser.lastName,
      roles: maybeUser.roles,
    });
  }
}
