import { Request, Response } from "express";

import { UserRepositoryInterface } from "../../../application/repositories/UserRepositoryInterface";
import { EmailValue } from "../../../domain/values/EmailValue";
import { InvalidEmailError } from "../../../domain/errors/values/email/InvalidEmailError";
import { UserNotFoundError } from "../../../domain/errors/entities/user/UserNotFoundError";
import { LoginCommand } from "../../../domain/commands/auth/LoginCommand";
import { RegisterCommand } from "../../../domain/commands/auth/RegisterCommand";
import { InvalidLoginCommandError } from "../../../domain/errors/commands/auth/InvalidLoginCommandError";
import { LoginUsecase } from "../../../application/usecases/auth/LoginUsecase";
import { RegisterUsecase } from "../../../application/usecases/auth/RegisterUsecase";
import { SendConfirmationEmailUsecase } from "../../../application/usecases/email/SendConfirmationEmailUsecase";
import { InvalidRegisterCommandError } from "../../../domain/errors/commands/auth/InvalidRegisterCommandError";
import { frontUrl } from "../utils/tools";
import { ConfirmAccountCommand } from "../../../domain/commands/auth/ConfirmAccountCommand";
import { InvalidConfirmAccountCommandError } from "../../../domain/errors/commands/auth/InvalidConfirmAccountCommandError";
import { ConfirmAccountUsecase } from "../../../application/usecases/auth/ConfirmAccountUsecase";
import { SendWelcomeEmailUsecase } from "../../../application/usecases/email/SendWelcomeEmailUsecase";
import { PasswordValue } from "../../../domain/values/PasswordValue";
import { InvalidPasswordError } from "../../../domain/errors/values/password/InvalidPasswordError";
import { MailerInterface } from "../../../application/services/email/MailerInterface";
import { PasswordHasherInterface } from "../../../application/services/password/PasswordHasherInterface";
import { UniqueIdGeneratorInterface } from "../../../application/services/uid/UniqueIdGeneratorInterface";
import { TokenManagerInterface } from "../../../application/services/token/TokenManagerInterface";
import { TokenPayloadValue } from "../../../domain/values/TokenPayloadValue";

export class AuthController {
  public constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly mailer: MailerInterface,
    private readonly passwordHasher: PasswordHasherInterface,
    private readonly uniqueIdGenerator: UniqueIdGeneratorInterface,
    private readonly tokenManager: TokenManagerInterface,
  ) {}

  public async login(request: Request, response: Response) {
    const maybeCommand = LoginCommand.from(request.body);
    if (maybeCommand instanceof InvalidLoginCommandError) {
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

    const loginUsecase = new LoginUsecase(this.userRepository, this.passwordHasher);
    const maybeUser = await loginUsecase.execute(maybeEmail.value, maybeCommand.password);

    if (maybeUser instanceof UserNotFoundError) {
      return response.status(401).json({
        error: 'Invalid credentials.',
      });
    }

    if (maybeUser instanceof Error) {
      return response.status(400).json({
        error: maybeUser.message,
      });
    }

    response.status(200).json({
      token: this.tokenManager.generate(TokenPayloadValue.from(maybeUser)),
    });
  }

  public async register(request: Request, response: Response) {
    const maybeCommand = RegisterCommand.from(request.body);
    if (maybeCommand instanceof InvalidRegisterCommandError) {
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

    const registerUsecase = new RegisterUsecase(this.userRepository, this.passwordHasher, this.uniqueIdGenerator);
    const maybeUser = await registerUsecase.execute(
      maybeEmail.value,
      maybePassword.value,
      maybeCommand.firstName,
      maybeCommand.lastName,
    );

    if (maybeUser instanceof Error) {
      return response.status(400).json({
        error: maybeUser.message,
      });
    }

    const sendEmailUsecase = new SendConfirmationEmailUsecase(this.mailer);
    await sendEmailUsecase.execute(
      maybeEmail,
      `${frontUrl}/confirm?token=${maybeUser.confirmationToken}`,
    );

    response.status(201).json({
      success: true,
    });
  }

  public async confirm(request: Request, response: Response) {
    const maybeCommand = ConfirmAccountCommand.from(request.body);
    if (maybeCommand instanceof InvalidConfirmAccountCommandError) {
      return response.status(400).json({
        error: maybeCommand.message,
      });
    }

    const confirmAccountUsecase = new ConfirmAccountUsecase(this.userRepository);
    const maybeUser = await confirmAccountUsecase.execute(maybeCommand.token);

    if (maybeUser instanceof Error) {
      return response.status(400).json({
        error: maybeUser.message,
      });
    }

    const sendEmailUsecase = new SendWelcomeEmailUsecase(this.mailer);
    await sendEmailUsecase.execute(
      maybeUser.email,
    );

    response.status(200).json({
      maybeUser,
    });
  }
}

