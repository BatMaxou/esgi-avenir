import { InvalidGetCompanyChannelParamsError } from "../../errors/params/company-channel/InvalidGetCompanyChannelParamsError";

interface Params {
  id?: string;
}

export class GetCompanyChannelParams {
  public static from(params: Params): GetCompanyChannelParams | InvalidGetCompanyChannelParamsError {
    if (!params.id) {
      return new InvalidGetCompanyChannelParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidGetCompanyChannelParamsError('Params not valid.');
    }

    return new GetCompanyChannelParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

