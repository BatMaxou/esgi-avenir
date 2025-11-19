import { StockOrderTypeEnum } from "../../enums/StockOrderTypeEnum";
import { InvalidCreateStockOrderCommandError } from "../../errors/commands/stock-order/InvalidCreateStockOrderCommandError";

interface Body {
  stockId?: number | string;
  accountId?: number | string;
  type?: string;
  amount?: number | string;
}

export class CreateStockOrderCommand {
  public static from(body: Body): CreateStockOrderCommand | InvalidCreateStockOrderCommandError {
    if (
      !body.stockId
      || typeof body.stockId !== 'number'
      || !body.accountId
      || typeof body.accountId !== 'number'
      || !body.amount
      || typeof body.amount !== 'number'
      || !body.type
    ) {
      return new InvalidCreateStockOrderCommandError('Payload is not valid.');
    }

    const type = body.type as StockOrderTypeEnum;
    if (!Object.values(StockOrderTypeEnum).includes(type)) {
      return new InvalidCreateStockOrderCommandError('Stock order type is not valid.');
    }

    return new CreateStockOrderCommand(
      body.stockId,
      body.accountId,
      type,
      body.amount,
    );
  }

  private constructor(
    public stockId: number,
    public accountId: number,
    public type: StockOrderTypeEnum,
    public amount: number,
  ) {
  }
}

