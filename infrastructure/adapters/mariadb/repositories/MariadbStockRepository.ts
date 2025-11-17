import { StockRepositoryInterface } from "../../../../application/repositories/StockRepositoryInterface";
import { Stock } from "../../../../domain/entities/Stock";
import { databaseDsn } from "../../../express/utils/tools";
import { MariadbConnection } from "../config/MariadbConnection";
import { StockModel } from "../models/StockModel";

export class MariadbStockRepository implements StockRepositoryInterface {
  private stockModel: StockModel;

  public constructor() {
    this.stockModel = new StockModel(new MariadbConnection(databaseDsn).getConnection());
  }

  public async create(stock: Stock): Promise<Stock> {
    try {
      const createdStock = await this.stockModel.model.create({
        name: stock.name,
        basePrice: stock.basePrice,
        baseQuantity: stock.baseQuantity,
      });

      const maybeStock = Stock.from(createdStock);
      if (maybeStock instanceof Error) {
        throw maybeStock;
      }

      return maybeStock;
    } catch (error) {
      throw error;
    }
  }
}
