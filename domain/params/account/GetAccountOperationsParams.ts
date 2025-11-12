import { InvalidGetAccountOperationsParamsError } from "../../errors/params/account/InvalidGetAccountOperationsParamsError";

interface Params {
  id?: string;
}

export class GetAccountOperationsParams {
  public static from(params: Params): GetAccountOperationsParams | InvalidGetAccountOperationsParamsError {
    if (!params.id) {
      return new InvalidGetAccountOperationsParamsError('Params not valid.');
    }

    return new GetAccountOperationsParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

