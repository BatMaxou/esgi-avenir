import { StockRepositoryInterface, UpdateStockPayload } from '../../repositories/StockRepositoryInterface';
import { Stock } from '../../../domain/entities/Stock';
import { StockNotFoundError } from '../../../domain/errors/entities/stock/StockNotFoundError';
import { InvalidBaseQuantityError } from '../../../domain/errors/entities/stock/InvalidBaseQuantityError';
import { DisabledStockError } from '../../../domain/errors/entities/stock/DisabledStockError';

export class UpdateStockUsecase {
  public constructor(
    private readonly stockRepository: StockRepositoryInterface,
  ) {}

  public async execute(stock: UpdateStockPayload): Promise<Stock | StockNotFoundError | InvalidBaseQuantityError | DisabledStockError> {
    const { id, ...toUpdate } = stock;

    const maybeStock = await this.stockRepository.findById(id);
    if (maybeStock instanceof StockNotFoundError) {
      return maybeStock;
    }

    if (maybeStock.disabled) {
      return new DisabledStockError('Cannot update a disabled stock');
    }

    if (toUpdate.baseQuantity && toUpdate.baseQuantity < maybeStock.baseQuantity) {
      return new InvalidBaseQuantityError('Base quantity cannot be decreased');
    }

    return await this.stockRepository.update(stock);
  }
}

