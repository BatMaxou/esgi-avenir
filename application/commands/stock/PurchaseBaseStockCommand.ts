import { PurchaseBaseStockPayloadInterface } from "../../../application/services/api/resources/StockResourceInterface";
import { InvalidPurchaseBaseStockCommandError } from "../../errors/commands/stock/InvalidPurchaseBaseStockCommandError";

interface Body extends Partial<PurchaseBaseStockPayloadInterface> {}

export class PurchaseBaseStockCommand {
  public static from(body: Body): PurchaseBaseStockCommand | InvalidPurchaseBaseStockCommandError {
    if (
      !body.accountId
      || typeof body.accountId !== 'number'
    ) {
      return new InvalidPurchaseBaseStockCommandError('Payload is not valid.');
    }

    return new PurchaseBaseStockCommand(
      body.accountId,
    );
  }

  private constructor(
    public accountId: number,
  ) {
  }
}

