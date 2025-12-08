import { InvalidCreateBankCreditCommandError } from "../../errors/commands/bank-credit/InvalidCreateBankCreditCommandError";
import { CreateBankCreditPayloadInterface } from "../../../application/services/api/resources/BankCreditResourceInterface";

interface Body extends Partial<CreateBankCreditPayloadInterface> {}

export class CreateBankCreditCommand {
  public static from(body: Body): CreateBankCreditCommand | InvalidCreateBankCreditCommandError {
    if (
      !body.amount
      || typeof body.amount !== 'number'
      || !body.interestPercentage
      || typeof body.interestPercentage !== 'number'
      || !body.insurancePercentage
      || typeof body.insurancePercentage !== 'number'
      || !body.durationInMonths
      || typeof body.durationInMonths !== 'number'
      || !body.ownerId
      || typeof body.ownerId !== 'number'
      || !body.accountId
      || typeof body.accountId !== 'number'
    ) {
      return new InvalidCreateBankCreditCommandError('Payload is not valid.');
    }

    return new CreateBankCreditCommand(
      body.amount,
      body.interestPercentage,
      body.insurancePercentage,
      body.durationInMonths,
      body.accountId,
      body.ownerId,
    );
  }

  private constructor(
    public readonly amount: number,
    public readonly interestPercentage: number,
    public readonly insurancePercentage: number,
    public readonly durationInMonths: number,
    public readonly accountId: number,
    public readonly ownerId: number,
  ) {
  }
}

