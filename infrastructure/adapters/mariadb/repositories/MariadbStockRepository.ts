import { Op } from "sequelize";
import { StockRepositoryInterface } from "../../../../application/repositories/StockRepositoryInterface";
import { Stock } from "../../../../domain/entities/Stock";
import { StockNotFoundError } from "../../../../domain/errors/entities/stock/StockNotFoundError";
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

  public async findById(id: number): Promise<Stock | StockNotFoundError> {
    try {
      const foundStock = await this.stockModel.model.findByPk(id);
      if (!foundStock) {
        return new StockNotFoundError('Stock not found.');
      }

      const maybeStock = Stock.from(foundStock);
      if (maybeStock instanceof Error) {
        throw maybeStock;
      }

      return maybeStock;
    } catch (error) {
      throw new StockNotFoundError('Stock not found');
    }
  }

  public async findAllLike(term: string): Promise<Stock[]> {
    const foundStocks = await this.stockModel.model.findAll({
      where: {
        name: {
          [Op.like]: `%${term}%`
        }
      },
    });

    const stocks: Stock[] = [];

    foundStocks.forEach((foundStock) => {
      const maybeStock = Stock.from(foundStock);
      if (maybeStock instanceof Error) {
        throw maybeStock;
      }

      stocks.push(maybeStock);
    });

    return stocks;
  }

  public async update(stock: Omit<Partial<Stock>, 'basePrice'> & { id: number }): Promise<Stock | StockNotFoundError> {
    try {
      const { id, ...toUpdate } = stock;

      await this.stockModel.model.update({
        ...toUpdate,
      }, {
        where: { id },
      });

      return await this.findById(id);
    } catch (error) {
      throw new StockNotFoundError('Stock not found.');
    }
  }
}
