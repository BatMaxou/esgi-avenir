import { InvalidPurchaseBaseStockParamsError } from "../../errors/params/stock/InvalidPurchaseBaseStockParamsError";

interface Params {
  id?: string;
}

export class PurchaseBaseStockParams {
  public static from(params: Params): PurchaseBaseStockParams | InvalidPurchaseBaseStockParamsError {
    if (!params.id) {
      return new InvalidPurchaseBaseStockParamsError('Params not valid.');
    }

    return new PurchaseBaseStockParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

