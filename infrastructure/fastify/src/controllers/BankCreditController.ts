import { FastifyReply, FastifyRequest } from "fastify";

import { MailerInterface } from "../../../../application/services/email/MailerInterface";
import { BankCreditRepositoryInterface } from "../../../../application/repositories/BankCreditRepositoryInterface";
import { SendBankCreditCreationEmailUsecase } from "../../../../application/usecases/email/SendBankCreditCreationEmailUsecase";
import { MonthlyPaymentRepositoryInterface } from "../../../../application/repositories/MonthlyPaymentRepositoryInterface";
import { CreateBankCreditUsecase } from "../../../../application/usecases/bank-credit/CreateBankCreditUsecase";
import { CreateBankCreditCommand } from "../../../../application/commands/bank-credit/CreateBankCreditCommand";
import { InvalidCreateBankCreditCommandError } from "../../../../application/errors/commands/bank-credit/InvalidCreateBankCreditCommandError";
import { GetBankCreditListUsecase } from "../../../../application/usecases/bank-credit/GetBankCreditListUsecase";
import { BankCreditNotFoundError } from "../../../../domain/errors/entities/bank-credit/BankCreditNotFoundError";
import { AccountRepositoryInterface } from "../../../../application/repositories/AccountRepositoryInterface";
import { UserRepositoryInterface } from "../../../../application/repositories/UserRepositoryInterface";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { GetBankCreditPaymentsParams } from "../../../../application/params/bank-credit/GetBankCreditPaymentsParams";
import { InvalidGetBankCreditPaymentsParamsError } from "../../../../application/errors/params/bank-credit/InvalidGetBankCreditPaymentsParamsError";
import { GetMonthlyPaymentListUsecase } from "../../../../application/usecases/monthly-payment/GetMonthlyPaymentListUsecase";
import { CreateBankCreditPayloadInterface } from "../../../../application/services/api/resources/BankCreditResourceInterface";
import { RessourceParamsInterface } from "../../../../application/params/RessourceParamsInterface";

export class BankCreditController {
  public constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly bankCreditRepository: BankCreditRepositoryInterface,
    private readonly monthlypaymentRepository: MonthlyPaymentRepositoryInterface,
    private readonly mailer: MailerInterface
  ) {}

  public async create(
    request: FastifyRequest<{ Body: CreateBankCreditPayloadInterface }>,
    response: FastifyReply
  ) {
    const maybeCommand = CreateBankCreditCommand.from(request.body);
    if (maybeCommand instanceof InvalidCreateBankCreditCommandError) {
      return response.status(400).send({
        error: maybeCommand.message,
      });
    }

    const maybeAdvisor = request.user;
    if (!maybeAdvisor) {
      return response.status(401).send({
        error: "Unauthorized",
      });
    }

    const maybeOwner = await this.userRepository.findById(maybeCommand.ownerId);
    if (maybeOwner instanceof UserNotFoundError) {
      return response.status(400).send({
        error: "Owner not found.",
      });
    }

    const createUsecase = new CreateBankCreditUsecase(
      this.accountRepository,
      this.bankCreditRepository
    );
    const maybeBankCredit = await createUsecase.execute(
      maybeCommand.amount,
      maybeCommand.insurancePercentage,
      maybeCommand.interestPercentage,
      maybeCommand.durationInMonths,
      maybeCommand.accountId,
      maybeCommand.ownerId,
      maybeAdvisor
    );

    if (maybeBankCredit instanceof Error) {
      return response.status(400).send({
        error: maybeBankCredit.message,
      });
    }

    const sendEmailUsecase = new SendBankCreditCreationEmailUsecase(
      this.mailer
    );
    await sendEmailUsecase.execute(maybeOwner.email);

    response.status(201).send({
      id: maybeBankCredit.id,
      amount: maybeBankCredit.amount,
      insurancePercentage: maybeBankCredit.insurancePercentage,
      interestPercentage: maybeBankCredit.interestPercentage,
      durationInMonths: maybeBankCredit.durationInMonths,
      status: maybeBankCredit.status,
      ...(maybeBankCredit.account
        ? {
            account: { iban: maybeBankCredit.account.iban },
          }
        : {}),
    });
  }

  public async list(request: FastifyRequest, response: FastifyReply) {
    const user = request.user;
    if (!user) {
      return response.status(401).send({
        error: "Unauthorized",
      });
    }

    const getBankCreditListUsecase = new GetBankCreditListUsecase(
      this.bankCreditRepository,
      this.monthlypaymentRepository
    );
    const bankCredits = await getBankCreditListUsecase.execute(user);

    const bankCreditsResponse = bankCredits.map((bankCredit) => ({
      id: bankCredit.id,
      amount: bankCredit.amount,
      insurancePercentage: bankCredit.insurancePercentage,
      interestPercentage: bankCredit.interestPercentage,
      durationInMonths: bankCredit.durationInMonths,
      status: bankCredit.status,
      remains: bankCredit.remains,
      ...(bankCredit.account
        ? {
            account: { iban: bankCredit.account.iban },
          }
        : {}),
      ...(bankCredit.owner
        ? {
            owner: {
              id: bankCredit.owner.id,
              email: bankCredit.owner.email,
              firstName: bankCredit.owner.firstName,
              lastName: bankCredit.owner.lastName,
            },
          }
        : {}),
    }));

    response.status(200).send(bankCreditsResponse);
  }

  public async listPayments(
    request: FastifyRequest<{ Params: RessourceParamsInterface }>,
    response: FastifyReply
  ) {
    const maybeParams = GetBankCreditPaymentsParams.from(request.params);
    if (maybeParams instanceof InvalidGetBankCreditPaymentsParamsError) {
      return response.status(400).send({
        error: maybeParams.message,
      });
    }

    const user = request.user;
    if (!user) {
      return response.status(401).send({
        error: "Unauthorized",
      });
    }

    const getListUsecase = new GetMonthlyPaymentListUsecase(
      this.bankCreditRepository,
      this.monthlypaymentRepository
    );
    const maybePayments = await getListUsecase.execute(maybeParams.id, user);

    if (maybePayments instanceof BankCreditNotFoundError) {
      return response.status(404).send({
        error: maybePayments.message,
      });
    }

    response.status(200).send(maybePayments);
  }
}
