import { InvalidGetAccountOperationsParamsError } from "../../errors/params/account/InvalidGetAccountOperationsParamsError";

interface Params {
  id?: string;
}

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

