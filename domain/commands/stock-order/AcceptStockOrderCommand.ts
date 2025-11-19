import { InvalidAcceptStockOrderCommandError } from "../../errors/commands/stock-order/InvalidAcceptStockOrderCommandError";

interface Body {
  withId?: number | string;
}

export class AcceptStockOrderCommand {
  public static from(body: Body): AcceptStockOrderCommand | InvalidAcceptStockOrderCommandError {
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

