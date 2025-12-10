import { InvalidAcceptStockOrderParamsError } from "../../errors/params/stock-order/InvalidAcceptStockOrderParamsError";
import { RessourceParamsInterface } from "../RessourceParamsInterface";

interface Params extends RessourceParamsInterface {}

export class AcceptStockOrderParams {
  public static from(params: Params): AcceptStockOrderParams | InvalidAcceptStockOrderParamsError {
    if (!params.id) {
      return new InvalidAcceptStockOrderParamsError('Params not valid.');
    }
    
    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidAcceptStockOrderParamsError('Params not valid.');
    }

    return new AcceptStockOrderParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

