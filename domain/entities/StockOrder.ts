import { User } from "./User";
import { InvalidOwnerError } from "../errors/entities/financial-security/InvalidOwnerError";
import { Stock } from "./Stock";
import { InvalidStockError } from "../errors/entities/financial-security/InvalidStockError";
import { InvalidPurchasePriceError } from "../errors/entities/financial-security/InvalidPurchasePriceError";
import { StockOrderTypeEnum } from "../enums/StockOrderTypeEnum";
import { StockOrderStatusEnum } from "../enums/StockOrderStatusEnum";

export class StockOrder {
  public id?: number;

  public static from({
    id,
    amount,
    type,
    status,
    ownerId,
    owner,
    stockId,
    stock,
  }: {
    id?: number,
    amount: number,
    type: StockOrderTypeEnum
    status: StockOrderStatusEnum,
    ownerId?: number,
    owner?: User,
    stockId?: number,
    stock?: Stock,
  }): StockOrder | InvalidOwnerError | InvalidStockError | InvalidPurchasePriceError {
    const maybeOwnerId = ownerId ?? owner?.id;
    if (!maybeOwnerId) {
      return new InvalidOwnerError('StockOrder must have a valid ownerId or owner.');
    }

    const maybeStockId = stockId ?? stock?.id;
    if (!maybeStockId) {
      return new InvalidStockError('StockOrder must have a valid stockId or stock.');
    }

    if (amount < 0) {
      return new InvalidStockError('StockOrder must have a non-negative purchase price.');
    }

    const stockOrder = new this(
      amount,
      type,
      status,
      maybeOwnerId,
      maybeStockId,
      owner ?? undefined,
      stock ?? undefined,
    );

    if (id) {
      stockOrder.id = id;
    }

    return stockOrder;
  }

  private constructor(
    public amount: number,
    public type: StockOrderTypeEnum,
    public status: StockOrderStatusEnum,
    public ownerId: number,
    public stockId: number,
    public owner?: User,
    public stock?: Stock,
  ) {
  }
}
