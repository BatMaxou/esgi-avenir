import { StockRepositoryInterface } from '../../repositories/StockRepositoryInterface';
import { Stock } from '../../../domain/entities/Stock';
import { StockNotFoundError } from '../../../domain/errors/entities/stock/StockNotFoundError';
import { InvalidBaseQuantityError } from '../../../domain/errors/entities/stock/InvalidBaseQuantityError';

export class UpdateStockUsecase {
  public constructor(
    private readonly stockRepository: StockRepositoryInterface,
  ) {}

  public async execute(
    id: number,
    toUpdate: Omit<Partial<Stock>, 'basePrice'>,
  ): Promise<Stock | StockNotFoundError | InvalidBaseQuantityError> {
    const maybeStock = await this.stockRepository.findById(id);
    if (maybeStock instanceof StockNotFoundError) {
      return maybeStock;
    }

    if (toUpdate.baseQuantity && toUpdate.baseQuantity < maybeStock.baseQuantity) {
      return new InvalidBaseQuantityError('Base quantity cannot be decreased');
    }

    return await this.stockRepository.update({
      id,
      ...toUpdate,
    });
  }
}

