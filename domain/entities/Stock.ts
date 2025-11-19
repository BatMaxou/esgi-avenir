import { InvalidBasePriceError } from "../errors/entities/stock/InvalidBasePriceError";
import { InvalidBaseQuantityError } from "../errors/entities/stock/InvalidBaseQuantityError";

export interface HydratedStock extends Stock {
  balance: number;
  remainingQuantity: number;
}

export class Stock {
  public id?: number;

  public static from({
    id,
    name,
    baseQuantity,
    basePrice,
    disabled,
  }: {
    id?: number,
    name: string,
    baseQuantity: number,
    basePrice: number,
    disabled: boolean,
  }): Stock | InvalidBasePriceError | InvalidBaseQuantityError {
    if (basePrice < 0) {
      return new InvalidBasePriceError('Base price cannot be negative.');
    }

    if (baseQuantity < 0) {
      return new InvalidBaseQuantityError('Base quantity cannot be negative.');
    }

    const stock = new this(
      name,
      Math.round(baseQuantity),
      Math.round(basePrice * 100) / 100,
      disabled,
    );

    if (id) {
      stock.id = id;
    }

    return stock;
  }

  private constructor(
    public name: string,
    public baseQuantity: number,
    public basePrice: number,
    public disabled: boolean,
  ) {
  }
}
