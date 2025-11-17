import { StockRepositoryInterface } from '../repositories/StockRepositoryInterface';
import { Stock } from '../../domain/entities/Stock';

type MockStock = {
  name: string,
  basePrice: number,
  baseQuantity: number,
}

export class StockFixtures {
  public constructor(
    private readonly repository: StockRepositoryInterface,
  ) {}

  public async load(): Promise<boolean | Error> {
    const stocks: MockStock[] = [
      {
        name: "Apple Inc.",
        basePrice: 200,
        baseQuantity: 5,
      },
      {
        name: "Microsoft Corporation",
        basePrice: 250,
        baseQuantity: 2, 
      },
      {
        name: "Amazon.com, Inc.",
        basePrice: 100,
        baseQuantity: 10,
      },
    ];

    for (const stock of stocks) {
      await this.createStock(stock);
    }

    return true;
  }

  private async createStock(mockStock: MockStock): Promise<boolean | Error> {
    const maybeStock = Stock.from(mockStock);
    if (maybeStock instanceof Error) {
      return maybeStock;
    }

    const maybeError = await this.repository.create(maybeStock);
    if (maybeError instanceof Error) {
      return maybeError;
    }

    return true;
  }
}
