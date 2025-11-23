import { StockOrderRepositoryInterface } from '../repositories/StockOrderRepositoryInterface';
import { StockOrder } from '../../domain/entities/StockOrder';
import { StockOrderTypeEnum } from '../../domain/enums/StockOrderTypeEnum';
import { StockOrderStatusEnum } from '../../domain/enums/StockOrderStatusEnum';

type MockStockOrder = {
  amount: number,
  type: StockOrderTypeEnum,
  status: StockOrderStatusEnum,
  ownerId: number,
  stockId: number,
  accountId: number,
}

export class StockOrderFixtures {
  public constructor(
    private readonly repository: StockOrderRepositoryInterface,
  ) {}

  public async load(): Promise<boolean | Error> {
    const stockOrders: MockStockOrder[] = [
      {
        amount: 300,
        type: StockOrderTypeEnum.SELL,
        status: StockOrderStatusEnum.PENDING,
        ownerId: 2,
        stockId: 1,
        accountId: 1,
      },
      {
        amount: 310,
        type: StockOrderTypeEnum.BUY,
        status: StockOrderStatusEnum.PENDING,
        ownerId: 3,
        stockId: 2,
        accountId: 4,
      },
      {
        amount: 150,
        type: StockOrderTypeEnum.SELL,
        status: StockOrderStatusEnum.PENDING,
        ownerId: 4,
        stockId: 3,
        accountId: 6,
      }
    ];

    for (const stockOrder of stockOrders) {
      await this.createStockOrder(stockOrder);
    }

    return true;
  }

  private async createStockOrder(mockStockOrder: MockStockOrder): Promise<boolean | Error> {
    const maybeStockOrder = StockOrder.from(mockStockOrder);
    if (maybeStockOrder instanceof Error) {
      return maybeStockOrder;
    }

    const maybeError = await this.repository.create(maybeStockOrder);
    if (maybeError instanceof Error) {
      return maybeError;
    }

    return true;
  }
}
