import { InvalidAcceptStockOrderParamsError } from "../../errors/params/stock-order/InvalidAcceptStockOrderParamsError";

interface Params {
  id?: string;
}

export class AcceptStockOrderParams {
  public static from(params: Params): AcceptStockOrderParams | InvalidAcceptStockOrderParamsError {
    if (!params.id) {
      return new InvalidAcceptStockOrderParamsError('Params not valid.');
    }

    return new AcceptStockOrderParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

