import { InvalidWriteCompanyMessageParamsError } from "../../errors/params/company-channel/InvalidWriteCompanyMessageParamsError";

interface Params {
  id?: string;
}

export class WriteCompanyMessageParams {
  public static from(params: Params): WriteCompanyMessageParams | InvalidWriteCompanyMessageParamsError {
    if (!params.id) {
      return new InvalidWriteCompanyMessageParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidWriteCompanyMessageParamsError('Params not valid.');
    }

    return new WriteCompanyMessageParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

