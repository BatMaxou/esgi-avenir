import { FinancialSecurity } from "../entities/FinancialSecurity";
import { Stock } from "../entities/Stock";

type MandatoryParameters = Pick<Stock, 'id' | 'baseQuantity'>;

export class RemainingStockQuantityValue {
  public static from(stock: MandatoryParameters, financialSecurities: FinancialSecurity[]): RemainingStockQuantityValue {
    const purchasedQuantity = financialSecurities.reduce((acc, financialSecurity) => {
      if (financialSecurity.stockId !== stock.id) {
        return acc;
      }

      return acc - 1;
    }, stock.baseQuantity);

    if (purchasedQuantity < 0) {
      return new RemainingStockQuantityValue(0);
    }

    return new RemainingStockQuantityValue(purchasedQuantity);
  }

  private constructor(public value: number) {}
}
