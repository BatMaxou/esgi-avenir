import { Stock } from "../entities/Stock";
import { StockOrder } from "../entities/StockOrder";
import { StockOrderStatusEnum } from "../enums/StockOrderStatusEnum";

type MandatoryParameters = Pick<Stock, 'id' | 'baseQuantity' | 'basePrice'>;

export class BalanceStockPriceValue {
  public static from(stock: MandatoryParameters, stockOrders: StockOrder[]): BalanceStockPriceValue {
    const total = stockOrders.reduce((acc, stockOrder) => {
      if (
        stockOrder.stockId !== stock.id
        || stockOrder.status !== StockOrderStatusEnum.COMPLETED
      ) {
        return acc;
      }

      return {
        total: acc.total + stockOrder.amount,
        count: acc.count + 1
      };
    }, { total: stock.basePrice * stock.baseQuantity, count: stock.baseQuantity });

    return new BalanceStockPriceValue(
      total.count === 0
        ? 0
        : (Math.round(total.total / total.count * 100) / 100)
    );
  }

  private constructor(public value: number) {}
}

