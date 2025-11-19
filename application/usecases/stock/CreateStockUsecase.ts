import { Stock } from '../../../domain/entities/Stock';
import { StockRepositoryInterface } from '../../repositories/StockRepositoryInterface';
import { InvalidBaseQuantityError } from '../../../domain/errors/entities/stock/InvalidBaseQuantityError';
import { InvalidBasePriceError } from '../../../domain/errors/entities/stock/InvalidBasePriceError';

export class CreateStockUsecase {
  public constructor(
    private readonly stockRepository: StockRepositoryInterface,
  ) {}

  public async execute(
    name: string,
    baseQuantity: number,
    basePrice: number,
  ): Promise<Stock | InvalidBaseQuantityError | InvalidBasePriceError> {
    const maybeNewStock = Stock.from({
      name,
      baseQuantity,
      basePrice,
      disabled: false,
    });
    if (
      maybeNewStock instanceof InvalidBaseQuantityError
      || maybeNewStock instanceof InvalidBasePriceError
    ) {
      return maybeNewStock;
    }

    return await this.stockRepository.create(maybeNewStock);
  }
}

