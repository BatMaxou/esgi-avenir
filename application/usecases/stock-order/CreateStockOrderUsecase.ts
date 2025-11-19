import { StockOrder } from '../../../domain/entities/StockOrder';
import { StockOrderRepositoryInterface } from '../../repositories/StockOrderRepositoryInterface';
import { User } from '../../../domain/entities/User';
import { StockOrderTypeEnum } from '../../../domain/enums/StockOrderTypeEnum';
import { StockOrderStatusEnum } from '../../../domain/enums/StockOrderStatusEnum';
import { InvalidAmountError } from '../../../domain/errors/entities/stock-order/InvalidAmountError';
import { InvalidOwnerError } from '../../../domain/errors/entities/stock-order/InvalidOwnerError';
import { InvalidStockError } from '../../../domain/errors/entities/stock-order/InvalidStockError';
import { InvalidAccountError } from '../../../domain/errors/entities/stock-order/InvalidAccountError';

export class CreateStockOrderUsecase {
  public constructor(
    private readonly stockOrderRepository: StockOrderRepositoryInterface,
  ) {}

  public async execute(
    amount: number,
    type: StockOrderTypeEnum,
    owner: User,
    stockId: number,
    accountId: number,
  ): Promise<StockOrder | InvalidAccountError | InvalidOwnerError | InvalidAmountError | InvalidStockError> {
    const maybeNewStockOrder = StockOrder.from({
      amount,
      type,
      status: StockOrderStatusEnum.PENDING,
      owner,
      stockId,
      accountId,
    });
    if (
      maybeNewStockOrder instanceof InvalidAccountError
      || maybeNewStockOrder instanceof InvalidOwnerError
      || maybeNewStockOrder instanceof InvalidAmountError
      || maybeNewStockOrder instanceof InvalidStockError
    ) {
      return maybeNewStockOrder;
    }

    return await this.stockOrderRepository.create(maybeNewStockOrder);
  }
}

