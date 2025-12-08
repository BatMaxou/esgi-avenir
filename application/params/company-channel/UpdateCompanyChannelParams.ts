import { InvalidUpdateCompanyChannelParamsError } from "../../errors/params/company-channel/InvalidUpdateCompanyChannelParamsError";

interface Params {
  id?: string;
}

export class UpdateCompanyChannelParams {
  public static from(params: Params): UpdateCompanyChannelParams | InvalidUpdateCompanyChannelParamsError {
    if (!params.id) {
      return new InvalidUpdateCompanyChannelParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidUpdateCompanyChannelParamsError('Params not valid.');
    }

    return new UpdateCompanyChannelParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

