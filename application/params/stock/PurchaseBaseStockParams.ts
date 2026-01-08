import { InvalidPurchaseBaseStockParamsError } from "../../errors/params/stock/InvalidPurchaseBaseStockParamsError";
import { RessourceParamsInterface } from "../RessourceParamsInterface";

interface Params extends RessourceParamsInterface {}

export class PurchaseBaseStockParams {
  public static from(params: Params): PurchaseBaseStockParams | InvalidPurchaseBaseStockParamsError {
    if (!params.id) {
      return new InvalidPurchaseBaseStockParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidPurchaseBaseStockParamsError('Params not valid.');
    }

    return new PurchaseBaseStockParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

