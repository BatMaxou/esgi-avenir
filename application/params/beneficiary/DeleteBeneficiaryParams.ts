import { InvalidDeleteBeneficiaryParamsError } from "../../errors/params/beneficiary/InvalidDeleteBeneficiaryParamsError";
import { RessourceParamsInterface } from "../RessourceParamsInterface";

interface Params extends RessourceParamsInterface {}

export class DeleteBeneficiaryParams {
  public static from(params: Params): DeleteBeneficiaryParams | InvalidDeleteBeneficiaryParamsError {
    if (!params.id) {
      return new InvalidDeleteBeneficiaryParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidDeleteBeneficiaryParamsError('Params not valid.');
    }

    return new DeleteBeneficiaryParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}


