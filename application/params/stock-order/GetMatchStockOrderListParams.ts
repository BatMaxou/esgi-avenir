import { InvalidGetMatchStockOrderListParamsError } from "../../errors/params/stock-order/InvalidGetMatchStockOrderListParamsError";

interface Params {
  id?: string;
}

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

