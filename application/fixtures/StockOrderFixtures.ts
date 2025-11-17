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
}

export class StockOrderFixtures {
  public constructor(
    private readonly repository: StockOrderRepositoryInterface,
  ) {}

  public async load(): Promise<boolean | Error> {
    const stockOrders: MockStockOrder[] = [
      this.buyStock1(2),
      this.buyStock1(2),
      this.buyStock1(2),
      this.buyStock1(3),
      this.buyStock1(3),
      this.buyStock2(2),
      this.buyStock2(2),
      // ------
      this.sellStock1(2, 300),
      {
        amount: 310,
        type: StockOrderTypeEnum.BUY,
        status: StockOrderStatusEnum.PENDING,
        ownerId: 3,
        stockId: 2,
      },
      // ------
      this.buyStock3(4),
      this.buyStock3(4),
      this.buyStock3(4),
      this.sellStock3(4, 150),
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

  private buyStock1(by: number): MockStockOrder {
    return {
      amount: 200,
      type: StockOrderTypeEnum.BUY,
      status: StockOrderStatusEnum.COMPLETED,
      ownerId: by,
      stockId: 1,
    };
  }

  private sellStock1(by: number, at: number): MockStockOrder {
    return {
      amount: at,
      type: StockOrderTypeEnum.SELL,
      status: StockOrderStatusEnum.PENDING,
      ownerId: by,
      stockId: 1,
    };
  }

  private buyStock2(by: number): MockStockOrder {
    return {
      amount: 250,
      type: StockOrderTypeEnum.BUY,
      status: StockOrderStatusEnum.COMPLETED,
      ownerId: by,
      stockId: 2,
    };
  }

  private buyStock3(by: number): MockStockOrder {
    return {
      amount: 100,
      type: StockOrderTypeEnum.BUY,
      status: StockOrderStatusEnum.COMPLETED,
      ownerId: by,
      stockId: 3,
    };
  }

  private sellStock3(by: number, at: number): MockStockOrder {
    return {
      amount: at,
      type: StockOrderTypeEnum.SELL,
      status: StockOrderStatusEnum.PENDING,
      ownerId: by,
      stockId: 3,
    };
  }
}
