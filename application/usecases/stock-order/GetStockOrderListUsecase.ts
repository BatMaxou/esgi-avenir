import { StockOrder } from '../../../domain/entities/StockOrder';
import { User } from '../../../domain/entities/User';
import { StockOrderRepositoryInterface } from '../../repositories/StockOrderRepositoryInterface';

export class GetStockOrderListUsecase {
  public constructor(
    private readonly stockOrderRepository: StockOrderRepositoryInterface,
  ) {}

  public async execute(
    owner: User,
  ): Promise<StockOrder[]> {
    if (!owner.id) {
      return [];
    }

    return await this.stockOrderRepository.findAllByOwner(owner.id);
  }
}

