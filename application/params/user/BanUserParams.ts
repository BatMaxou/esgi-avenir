import { InvalidBanUserParamsError } from "../../errors/params/user/InvalidBanUserParamsError";
import { RessourceParamsInterface } from "../RessourceParamsInterface";

interface Params extends RessourceParamsInterface {}

export class BanUserParams {
  public static from(params: Params): BanUserParams | InvalidBanUserParamsError {
    if (!params.id) {
      return new InvalidBanUserParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidBanUserParamsError('Params not valid.');
    }

    return new BanUserParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}


