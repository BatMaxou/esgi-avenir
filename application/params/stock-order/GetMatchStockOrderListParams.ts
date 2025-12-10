import { InvalidGetMatchStockOrderListParamsError } from "../../errors/params/stock-order/InvalidGetMatchStockOrderListParamsError";
import { RessourceParamsInterface } from "../RessourceParamsInterface";

interface Params extends RessourceParamsInterface {}

export class GetMatchStockOrderListParams {
  public static from(params: Params): GetMatchStockOrderListParams | InvalidGetMatchStockOrderListParamsError {
    if (!params.id) {
      return new InvalidGetMatchStockOrderListParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidGetMatchStockOrderListParamsError('Params not valid.');
    }

    return new GetMatchStockOrderListParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

