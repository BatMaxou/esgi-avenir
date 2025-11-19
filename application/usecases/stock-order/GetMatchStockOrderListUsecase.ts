import { StockOrder } from '../../../domain/entities/StockOrder';
import { StockOrderTypeEnum } from '../../../domain/enums/StockOrderTypeEnum';
import { StockOrderNotFoundError } from '../../../domain/errors/entities/stock-order/StockOrderNotFoundError';
import { StockOrderRepositoryInterface } from '../../repositories/StockOrderRepositoryInterface';

export class GetMatchStockOrderListUsecase {
  public constructor(
    private readonly stockOrderRepository: StockOrderRepositoryInterface,
  ) {}

  public async execute(
    stockOrderId: number,
  ): Promise<StockOrder[]> {
    const maybeStockOrder = await this.stockOrderRepository.findById(stockOrderId);
    if (maybeStockOrder instanceof StockOrderNotFoundError) {
      return [];
    }

    const matchingType = this.getMatchingType(maybeStockOrder.type);
    if (!matchingType) {
      return [];
    }

    return await this.stockOrderRepository.findMatchByStock(maybeStockOrder.stockId, matchingType);
  }

  private getMatchingType(type: StockOrderTypeEnum): StockOrderTypeEnum | null {
    switch (type) {
      case StockOrderTypeEnum.BUY:
        return StockOrderTypeEnum.SELL;
      case StockOrderTypeEnum.SELL:
        return StockOrderTypeEnum.BUY;
      default:
        return null;
    }
  }
}

