import { CreateAccountPayloadInterface } from "../../../application/services/api/resources/AccountResourceInterface";
import { InvalidCreateBeneficiaryCommandError } from "../../errors/commands/beneficiary/InvalidCreateBeneficiaryCommandError";
import { InvalidIbanError } from "../../errors/values/iban/InvalidIbanError";
import { IbanValue } from "../../values/IbanValue";

interface Body extends Partial<CreateAccountPayloadInterface> {}

export class CreateBeneficiaryCommand {
  public static from(body: Body): CreateBeneficiaryCommand | InvalidCreateBeneficiaryCommandError | InvalidIbanError {
    if (
      !body.iban
      || typeof body.iban !== 'string'
    ) {
      return new InvalidCreateBeneficiaryCommandError('Payload is not valid.');
    }

    const maybeIban = IbanValue.from(body.iban);
    if (maybeIban instanceof InvalidIbanError) {
      return maybeIban;
    }

    return new CreateBeneficiaryCommand(
      maybeIban,
      body.name,
    );
  }

  private constructor(
    public iban: IbanValue,
    public name?: string,
  ) {
  }
}

