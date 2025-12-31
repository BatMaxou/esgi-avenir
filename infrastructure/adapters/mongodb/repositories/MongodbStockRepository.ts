import {
  StockRepositoryInterface,
  UpdateStockPayload,
} from "../../../../application/repositories/StockRepositoryInterface";
import { Stock } from "../../../../domain/entities/Stock";
import { StockNotFoundError } from "../../../../domain/errors/entities/stock/StockNotFoundError";
import { StockModel } from "../models/StockModel";
import { getNextSequence } from "../models/CounterModel";
import { openConnection } from "../config/MongodbConnection";

export class MongodbStockRepository implements StockRepositoryInterface {
  private initialized: boolean = false;

  public constructor() {
    this.ensureConnection();
  }

  private async ensureConnection(): Promise<void> {
    if (!this.initialized) {
      await openConnection();
      this.initialized = true;
    }
  }

  public async create(stock: Stock): Promise<Stock> {
    try {
      await this.ensureConnection();

      const nextId = await getNextSequence("stock_id");

      const createdStock = await StockModel.create({
        id: nextId,
        name: stock.name,
        basePrice: stock.basePrice,
        baseQuantity: stock.baseQuantity,
        disabled: stock.disabled,
      });

      const maybeStock = Stock.from({
        id: createdStock.id,
        name: createdStock.name,
        basePrice: createdStock.basePrice,
        baseQuantity: createdStock.baseQuantity,
        disabled: createdStock.disabled,
      });

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
      await this.ensureConnection();

      const foundStock = await StockModel.findOne({ id });

      if (!foundStock) {
        return new StockNotFoundError("Stock not found.");
      }

      const maybeStock = Stock.from({
        id: foundStock.id,
        name: foundStock.name,
        basePrice: foundStock.basePrice,
        baseQuantity: foundStock.baseQuantity,
        disabled: foundStock.disabled,
      });

      if (maybeStock instanceof Error) {
        throw maybeStock;
      }

      return maybeStock;
    } catch (error) {
      return new StockNotFoundError("Stock not found");
    }
  }

  public async findAllLike(term: string): Promise<Stock[]> {
    try {
      await this.ensureConnection();

      const foundStocks = await StockModel.find({
        name: { $regex: term, $options: "i" },
      });

      const stocks: Stock[] = [];

      foundStocks.forEach((foundStock) => {
        const maybeStock = Stock.from({
          id: foundStock.id,
          name: foundStock.name,
          basePrice: foundStock.basePrice,
          baseQuantity: foundStock.baseQuantity,
          disabled: foundStock.disabled,
        });

        if (maybeStock instanceof Error) {
          throw maybeStock;
        }

        stocks.push(maybeStock);
      });

      return stocks;
    } catch (error) {
      return [];
    }
  }

  public async update(
    stock: UpdateStockPayload
  ): Promise<Stock | StockNotFoundError> {
    try {
      await this.ensureConnection();

      const { id, ...toUpdate } = stock;

      const updatedStock = await StockModel.findOneAndUpdate({ id }, toUpdate, {
        new: true,
      });

      if (!updatedStock) {
        return new StockNotFoundError("Stock not found.");
      }

      return await this.findById(id);
    } catch (error) {
      return new StockNotFoundError("Stock not found.");
    }
  }
}
