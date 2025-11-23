import { InvalidDeleteBeneficiaryParamsError } from "../../errors/params/beneficiary/InvalidDeleteBeneficiaryParamsError";

interface Params {
  id?: string;
}

export class DeleteBeneficiaryParams {
  public static from(params: Params): DeleteBeneficiaryParams | InvalidDeleteBeneficiaryParamsError {
    if (!params.id) {
      return new InvalidDeleteBeneficiaryParamsError('Params not valid.');
    }

    return new DeleteBeneficiaryParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}


