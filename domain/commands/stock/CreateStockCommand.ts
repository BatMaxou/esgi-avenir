import { InvalidCreateStockCommandError } from "../../errors/commands/stock/InvalidCreateStockCommandError";

interface Body {
  name?: string,
  baseQuantity?: number,
  basePrice?: number,
}

export class CreateStockCommand {
  public static from(body: Body): CreateStockCommand | InvalidCreateStockCommandError {
    if (!body.name || !body.basePrice || !body.baseQuantity) {
      return new InvalidCreateStockCommandError('Payload is not valid.');
    }

    return new CreateStockCommand(
      body.name,
      body.baseQuantity,
      body.basePrice,
    );
  }

  private constructor(
    public name: string,
    public baseQuantity: number,
    public basePrice: number,
  ) {
  }
}

