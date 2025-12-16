import { InvalidGetAccountByUserParamsError } from "../../errors/params/account/InvalidGetAccountByUserParamsError";
import { RessourceParamsInterface } from "../RessourceParamsInterface";

interface Params extends RessourceParamsInterface {}

export class GetAccountByUserParams {
  public static from(
    params: Params
  ): GetAccountByUserParams | InvalidGetAccountByUserParamsError {
    if (!params.id) {
      return new InvalidGetAccountByUserParamsError("Params not valid.");
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidGetAccountByUserParamsError("Params not valid.");
    }

    return new GetAccountByUserParams(id);
  }

  private constructor(public id: number) {}
}
