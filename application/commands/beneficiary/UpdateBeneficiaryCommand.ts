import { UpdateBeneficiaryPayloadInterface } from "../../../application/services/api/resources/BeneficiaryResourceInterface";
import { InvalidUpdateBeneficiaryCommandError } from "../../errors/commands/beneficiary/InvalidUpdateBeneficiaryCommandError";

interface Body extends Partial<UpdateBeneficiaryPayloadInterface> {}

export class UpdateBeneficiaryCommand {
  public static from(body: Body): UpdateBeneficiaryCommand | InvalidUpdateBeneficiaryCommandError {
    if (!body.name) {
      return new InvalidUpdateBeneficiaryCommandError('Payload is not valid.');
    }

    return new UpdateBeneficiaryCommand(
      body.name,
    );
  }

  private constructor(
    public name: string,
  ) {
  }
}

