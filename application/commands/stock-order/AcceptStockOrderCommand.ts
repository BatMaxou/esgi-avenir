import { InvalidAcceptStockOrderCommandError } from "../../errors/commands/stock-order/InvalidAcceptStockOrderCommandError";

export interface AcceptStockOrderBody {
  withId?: number | string;
}

export class AcceptStockOrderCommand {
  public static from(body: AcceptStockOrderBody): AcceptStockOrderCommand | InvalidAcceptStockOrderCommandError {
    if (
      !body.withId
      || typeof body.withId !== 'number'
    ) {
      return new InvalidAcceptStockOrderCommandError('Payload is not valid.');
    }

    return new AcceptStockOrderCommand(
      body.withId,
    );
  }

  private constructor(
    public withId: number,
  ) {
  }
}

