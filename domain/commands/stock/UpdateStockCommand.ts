import { InvalidUpdateStockCommandError } from "../../errors/commands/stock/InvalidUpdateStockCommandError";

interface Body {
  name?: string;
  baseQuantity?: number,
}

export class UpdateStockCommand {
  public static from(body: Body): UpdateStockCommand | InvalidUpdateStockCommandError {
    if (
      body.name && typeof body.name !== 'string'
      || body.baseQuantity && typeof body.baseQuantity !== 'number'
    ) {
      return new InvalidUpdateStockCommandError('Payload is not valid.');
    }

    return new UpdateStockCommand(
      body.name,
      body.baseQuantity,
    );
  }

  private constructor(
    public name?: string,
    public baseQuantity?: number,
  ) {
  }
}

