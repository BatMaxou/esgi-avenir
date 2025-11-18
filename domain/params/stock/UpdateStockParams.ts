import { InvalidUpdateStockParamsError } from "../../errors/params/stock/InvalidUpdateStockParamsError";

interface Params {
  id?: string;
}

export class UpdateStockParams {
  public static from(params: Params): UpdateStockParams | InvalidUpdateStockParamsError {
    if (!params.id) {
      return new InvalidUpdateStockParamsError('Params not valid.');
    }

    return new UpdateStockParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

