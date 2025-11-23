import { InvalidUpdateBeneficiaryParamsError } from "../../errors/params/beneficiary/InvalidUpdateBeneficiaryParamsError";

interface Params {
  id?: string;
}

export class UpdateBeneficiaryParams {
  public static from(params: Params): UpdateBeneficiaryParams | InvalidUpdateBeneficiaryParamsError {
    if (!params.id) {
      return new InvalidUpdateBeneficiaryParamsError('Params not valid.');
    }

    return new UpdateBeneficiaryParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

