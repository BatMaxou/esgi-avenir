import { User } from "./User";
import { InvalidOwnerError } from "../errors/entities/financial-security/InvalidOwnerError";
import { Stock } from "./Stock";
import { InvalidStockError } from "../errors/entities/financial-security/InvalidStockError";
import { InvalidPurchasePriceError } from "../errors/entities/financial-security/InvalidPurchasePriceError";

export class FinancialSecurity {
  public id?: number;

  public static from({
    id,
    purchasePrice,
    ownerId,
    owner,
    stockId,
    stock,
  }: {
    id?: number,
    purchasePrice: number,
    ownerId?: number,
    owner?: User,
    stockId?: number,
    stock?: Stock,
  }): FinancialSecurity | InvalidOwnerError | InvalidStockError | InvalidPurchasePriceError {
    const maybeOwnerId = ownerId ?? owner?.id;
    if (!maybeOwnerId) {
      return new InvalidOwnerError('FinancialSecurity must have a valid ownerId or owner.');
    }

    const maybeStockId = stockId ?? stock?.id;
    if (!maybeStockId) {
      return new InvalidStockError('FinancialSecurity must have a valid stockId or stock.');
    }

    if (purchasePrice < 0) {
      return new InvalidStockError('FinancialSecurity must have a non-negative purchase price.');
    }

    const financialSecurity = new this(
      purchasePrice,
      maybeOwnerId,
      maybeStockId,
      owner ?? undefined,
      stock ?? undefined,
    );

    if (id) {
      financialSecurity.id = id;
    }

    return financialSecurity;
  }

  private constructor(
    public purchasePrice: number,
    public ownerId: number,
    public stockId: number,
    public owner?: User,
    public stock?: Stock,
  ) {
  }
}
