import { InvalidGetCompanyChannelParamsError } from "../../errors/params/company-channel/InvalidGetCompanyChannelParamsError";
import { RessourceParamsInterface } from "../RessourceParamsInterface";

interface Params extends RessourceParamsInterface {}

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

