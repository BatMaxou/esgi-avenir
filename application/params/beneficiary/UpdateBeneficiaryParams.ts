import { InvalidUpdateBeneficiaryParamsError } from "../../errors/params/beneficiary/InvalidUpdateBeneficiaryParamsError";
import { RessourceParamsInterface } from "../RessourceParamsInterface";

interface Params extends RessourceParamsInterface {}

export class UpdateBeneficiaryParams {
  public static from(params: Params): UpdateBeneficiaryParams | InvalidUpdateBeneficiaryParamsError {
    if (!params.id) {
      return new InvalidUpdateBeneficiaryParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidUpdateBeneficiaryParamsError('Params not valid.');
    }

    return new UpdateBeneficiaryParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

