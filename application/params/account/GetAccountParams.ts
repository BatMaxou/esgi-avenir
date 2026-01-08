import { InvalidGetAccountParamsError } from "../../errors/params/account/InvalidGetAccountParamsError";
import { RessourceParamsInterface } from "../RessourceParamsInterface";

interface Params extends RessourceParamsInterface {}

export class GetAccountParams {
  public static from(params: Params): GetAccountParams | InvalidGetAccountParamsError {
    if (!params.id) {
      return new InvalidGetAccountParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidGetAccountParamsError('Params not valid.');
    }

    return new GetAccountParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

