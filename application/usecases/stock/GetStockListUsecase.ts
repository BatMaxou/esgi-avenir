import { StockRepositoryInterface } from '../../repositories/StockRepositoryInterface';
import { Stock } from '../../../domain/entities/Stock';

export class GetStockListUsecase {
  public constructor(
    private readonly stockRepository: StockRepositoryInterface,
  ) {}

  public async execute(term: string): Promise<Stock[]> {
    return await this.stockRepository.findAllLike(term);
  }
}

