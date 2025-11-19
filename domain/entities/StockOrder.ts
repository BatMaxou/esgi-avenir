import { User } from "./User";
import { Stock } from "./Stock";
import { StockOrderTypeEnum } from "../enums/StockOrderTypeEnum";
import { StockOrderStatusEnum } from "../enums/StockOrderStatusEnum";
import { Account } from "./Account";
import { InvalidAccountError } from "../errors/entities/stock-order/InvalidAccountError";
import { InvalidOwnerError } from "../errors/entities/stock-order/InvalidOwnerError";
import { InvalidAmountError } from "../errors/entities/stock-order/InvalidAmountError";
import { InvalidStockError } from "../errors/entities/stock-order/InvalidStockError";

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
    accountId,
    account,
  }: {
    id?: number,
    amount: number,
    type: StockOrderTypeEnum
    status: StockOrderStatusEnum,
    ownerId?: number,
    owner?: User,
    stockId?: number,
    stock?: Stock,
    accountId?: number,
    account?: Account,
  }): StockOrder | InvalidOwnerError | InvalidStockError | InvalidAccountError | InvalidAmountError {
    const maybeOwnerId = ownerId ?? owner?.id;
    if (!maybeOwnerId) {
      return new InvalidOwnerError('StockOrder must have a valid ownerId or owner.');
    }

    const maybeStockId = stockId ?? stock?.id;
    if (!maybeStockId) {
      return new InvalidStockError('StockOrder must have a valid stockId or stock.');
    }

    const maybeAccountId = accountId ?? account?.id;
    if (!maybeAccountId) {
      return new InvalidAccountError('StockOrder must have a valid accountId or account.');
    }

    if (amount < 0) {
      return new InvalidAmountError('StockOrder must have a non-negative purchase price.');
    }

    const stockOrder = new this(
      Math.round(amount * 100) / 100,
      type,
      status,
      maybeOwnerId,
      maybeStockId,
      maybeAccountId,
      owner ?? undefined,
      stock ?? undefined,
      account ?? undefined,
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
    public accountId: number,
    public owner?: User,
    public stock?: Stock,
    public account?: Account,
  ) {
  }
}
