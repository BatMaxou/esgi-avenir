import { InvalidGetAccountOperationsParamsError } from "../../errors/params/account/InvalidGetAccountOperationsParamsError";
import { RessourceParamsInterface } from "../RessourceParamsInterface";

interface Params extends RessourceParamsInterface {}

export class GetAccountOperationsParams {
  public static from(params: Params): GetAccountOperationsParams | InvalidGetAccountOperationsParamsError {
    if (!params.id) {
      return new InvalidGetAccountOperationsParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidGetAccountOperationsParamsError('Params not valid.');
    }

    return new GetAccountOperationsParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

