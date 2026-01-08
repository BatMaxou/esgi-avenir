import { User } from '../../../domain/entities/User';
import { StockOrderStatusEnum } from '../../../domain/enums/StockOrderStatusEnum';
import { InvalidStatusError } from '../../../domain/errors/entities/stock-order/InvalidStatusError';
import { StockOrderNotFoundError } from '../../../domain/errors/entities/stock-order/StockOrderNotFoundError';
import { StockOrderRepositoryInterface } from '../../repositories/StockOrderRepositoryInterface';

export class DeleteStockOrderUsecase {
  public constructor(
    private readonly stockOrderRepository: StockOrderRepositoryInterface,
  ) {}

  public async execute(
    id: number,
    owner: User,
  ): Promise<boolean | StockOrderNotFoundError> {
    const maybeStockOrder = await this.stockOrderRepository.findById(id);
    if (maybeStockOrder instanceof StockOrderNotFoundError) {
      return maybeStockOrder;
    }

    if (maybeStockOrder.ownerId !== owner.id) {
      return new StockOrderNotFoundError('StockOrder not found.');
    }

    if (maybeStockOrder.status !== StockOrderStatusEnum.PENDING) {
      return new InvalidStatusError('Only pending stock orders can be deleted.');
    }

    return await this.stockOrderRepository.delete(id);
  }
}

