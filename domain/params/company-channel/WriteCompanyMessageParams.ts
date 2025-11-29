import { InvalidWriteCompanyMessageParamsError } from "../../errors/params/company-channel/InvalidWriteCompanyMessageParamsError";

interface Params {
  id?: string;
}

export class WriteCompanyMessageParams {
  public static from(params: Params): WriteCompanyMessageParams | InvalidWriteCompanyMessageParamsError {
    if (!params.id) {
      return new InvalidWriteCompanyMessageParamsError('Params not valid.');
    }

    return new WriteCompanyMessageParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

