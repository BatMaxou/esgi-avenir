import { StockRepositoryInterface } from '../../repositories/StockRepositoryInterface';
import { HydratedStock } from '../../../domain/entities/Stock';
import { BalanceStockPriceValue } from '../../../domain/values/BalanceStockPriceValue';
import { StockOrderRepositoryInterface } from '../../repositories/StockOrderRepositoryInterface';
import { FinancialSecurityRepositoryInterface } from '../../repositories/FinancialSecurityRepositoryInterface';
import { RemainingStockQuantityValue } from '../../../domain/values/RemainingStockQuantityValue';

export class GetStockListUsecase {
  public constructor(
    private readonly stockRepository: StockRepositoryInterface,
    private readonly stockOrderRepository: StockOrderRepositoryInterface,
    private readonly financialSecurityRepository: FinancialSecurityRepositoryInterface,
  ) {}

  public async execute(term: string): Promise<HydratedStock[]> {
    const stocks = await this.stockRepository.findAllLike(term);

    return Promise.all(stocks.filter((stock) => !stock.disabled).map(async (stock) => {
      const id = stock.id;
      if (!id) {
        return { ...stock, balance: 0, remainingQuantity: 0 };
      }

      const stockOrders = await this.stockOrderRepository.findCompletedByStock(id);
      const balanceValue = BalanceStockPriceValue.from({
        id,
        basePrice: stock.basePrice,
        baseQuantity: stock.baseQuantity,
      }, stockOrders);

      const financialSecurities = await this.financialSecurityRepository.findAllByStock(id);
      const remainingQuantity = RemainingStockQuantityValue.from({
        id,
        baseQuantity: stock.baseQuantity,
      }, financialSecurities);

      return {
        ...stock,
        balance: balanceValue.value,
        remainingQuantity: remainingQuantity.value,
      };
    }));
  }
}

