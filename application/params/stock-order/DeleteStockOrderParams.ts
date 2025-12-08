import { InvalidDeleteStockOrderParamsError } from "../../errors/params/stock-order/InvalidDeleteStockOrderParamsError";

interface Params {
  id?: string;
}

export class DeleteStockOrderParams {
  public static from(params: Params): DeleteStockOrderParams | InvalidDeleteStockOrderParamsError {
    if (!params.id) {
      return new InvalidDeleteStockOrderParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidDeleteStockOrderParamsError('Params not valid.');
    }

    return new DeleteStockOrderParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}


