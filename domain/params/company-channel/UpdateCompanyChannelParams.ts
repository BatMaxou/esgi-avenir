import { InvalidUpdateCompanyChannelParamsError } from "../../errors/params/company-channel/InvalidUpdateCompanyChannelParamsError";

interface Params {
  id?: string;
}

export class UpdateCompanyChannelParams {
  public static from(params: Params): UpdateCompanyChannelParams | InvalidUpdateCompanyChannelParamsError {
    if (!params.id) {
      return new InvalidUpdateCompanyChannelParamsError('Params not valid.');
    }

    return new UpdateCompanyChannelParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

