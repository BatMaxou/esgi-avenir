import { InvalidGetMatchStockOrderListParamsError } from "../../errors/params/stock-order/InvalidGetMatchStockOrderListParamsError";

interface Params {
  id?: string;
}

export class GetMatchStockOrderListParams {
  public static from(params: Params): GetMatchStockOrderListParams | InvalidGetMatchStockOrderListParamsError {
    if (!params.id) {
      return new InvalidGetMatchStockOrderListParamsError('Params not valid.');
    }

    return new GetMatchStockOrderListParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

