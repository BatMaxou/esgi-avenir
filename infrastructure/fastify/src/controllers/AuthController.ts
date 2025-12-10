import { FastifyRequest, FastifyReply } from "fastify";

import { UserRepositoryInterface } from "../../../../application/repositories/UserRepositoryInterface";
import { EmailValue } from "../../../../domain/values/EmailValue";
import { InvalidEmailError } from "../../../../domain/errors/values/email/InvalidEmailError";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { LoginBody, LoginCommand } from "../../../../application/commands/auth/LoginCommand";
import { RegisterBody, RegisterCommand } from "../../../../application/commands/auth/RegisterCommand";
import { InvalidLoginCommandError } from "../../../../application/errors/commands/auth/InvalidLoginCommandError";
import { LoginUsecase } from "../../../../application/usecases/auth/LoginUsecase";
import { SendConfirmationEmailUsecase } from "../../../../application/usecases/email/SendConfirmationEmailUsecase";
import { InvalidRegisterCommandError } from "../../../../application/errors/commands/auth/InvalidRegisterCommandError";
import { frontUrl } from "../utils/tools";
import { ConfirmAccountCommand, ConfirmBody } from "../../../../application/commands/auth/ConfirmAccountCommand";
import { InvalidConfirmAccountCommandError } from "../../../../application/errors/commands/auth/InvalidConfirmAccountCommandError";
import { ConfirmAccountUsecase } from "../../../../application/usecases/auth/ConfirmAccountUsecase";
import { SendWelcomeEmailUsecase } from "../../../../application/usecases/email/SendWelcomeEmailUsecase";
import { PasswordValue } from "../../../../domain/values/PasswordValue";
import { InvalidPasswordError } from "../../../../domain/errors/values/password/InvalidPasswordError";
import { MailerInterface } from "../../../../application/services/email/MailerInterface";
import { PasswordHasherInterface } from "../../../../application/services/password/PasswordHasherInterface";
import { UniqueIdGeneratorInterface } from "../../../../application/services/uid/UniqueIdGeneratorInterface";
import { TokenManagerInterface } from "../../../../application/services/token/TokenManagerInterface";
import { TokenPayloadValue } from "../../../../domain/values/TokenPayloadValue";
import { CreateUserUsecase } from "../../../../application/usecases/user/CreateUserUsecase";

export class AuthController {
  public constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly mailer: MailerInterface,
    private readonly passwordHasher: PasswordHasherInterface,
    private readonly uniqueIdGenerator: UniqueIdGeneratorInterface,
    private readonly tokenManager: TokenManagerInterface,
  ) {}

  public async login(request: FastifyRequest<{Body: LoginBody}>, response: FastifyReply) {
    const maybeCommand = LoginCommand.from(request.body);
    if (maybeCommand instanceof InvalidLoginCommandError) {
      return response.status(400).send({
        error: maybeCommand.message,
      });
    }

    const maybeEmail = EmailValue.from(maybeCommand.email);
    if (maybeEmail instanceof InvalidEmailError) {
      return response.status(400).send({
        error: maybeEmail.message,
      });
    }

    const loginUsecase = new LoginUsecase(this.userRepository, this.passwordHasher);
    const maybeUser = await loginUsecase.execute(maybeEmail.value, maybeCommand.password);

    if (maybeUser instanceof UserNotFoundError) {
      return response.status(401).send({
        error: 'Invalid credentials.',
      });
    }

    if (maybeUser instanceof Error) {
      return response.status(400).send({
        error: maybeUser.message,
      });
    }

    response.status(200).send({
      token: this.tokenManager.generate(TokenPayloadValue.from(maybeUser)),
    });
  }

  public async register(request: FastifyRequest<{Body: RegisterBody}>, response: FastifyReply) {
    const maybeCommand = RegisterCommand.from(request.body);
    if (maybeCommand instanceof InvalidRegisterCommandError) {
      return response.status(400).send({
        error: maybeCommand.message,
      });
    }

    const maybeEmail = EmailValue.from(maybeCommand.email);
    if (maybeEmail instanceof InvalidEmailError) {
      return response.status(400).send({
        error: maybeEmail.message,
      });
    }

    const maybePassword = PasswordValue.from(maybeCommand.password);
    if (maybePassword instanceof InvalidPasswordError) {
      return response.status(400).send({
        error: maybePassword.message,
      });
    }

    const registerUsecase = new CreateUserUsecase(this.userRepository, this.passwordHasher, this.uniqueIdGenerator);
    const maybeUser = await registerUsecase.execute(
      maybeEmail.value,
      maybePassword.value,
      maybeCommand.firstName,
      maybeCommand.lastName,
    );

    if (maybeUser instanceof Error) {
      return response.status(400).send({
        error: maybeUser.message,
      });
    }

    const sendEmailUsecase = new SendConfirmationEmailUsecase(this.mailer);
    await sendEmailUsecase.execute(
      maybeEmail,
      `${frontUrl}/confirm?token=${maybeUser.confirmationToken}`,
    );

    response.status(201).send({
      success: true,
    });
  }

  public async confirm(request: FastifyRequest<{Body: ConfirmBody}>, response: FastifyReply) {
    const maybeCommand = ConfirmAccountCommand.from(request.body);
    if (maybeCommand instanceof InvalidConfirmAccountCommandError) {
      return response.status(400).send({
        error: maybeCommand.message,
      });
    }

    const confirmAccountUsecase = new ConfirmAccountUsecase(this.userRepository);
    const maybeUser = await confirmAccountUsecase.execute(maybeCommand.token);

    if (maybeUser instanceof Error) {
      return response.status(400).send({
        error: maybeUser.message,
      });
    }

    const sendEmailUsecase = new SendWelcomeEmailUsecase(this.mailer);
    await sendEmailUsecase.execute(
      maybeUser.email,
    );

    response.status(200).send({
      success: true,
    });
  }
}

