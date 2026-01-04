import {
  StockOrderRepositoryInterface,
  UpdateStockOrderPayload,
} from "../../../../application/repositories/StockOrderRepositoryInterface";
import { StockOrder } from "../../../../domain/entities/StockOrder";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { StockNotFoundError } from "../../../../domain/errors/entities/stock/StockNotFoundError";
import { AccountNotFoundError } from "../../../../domain/errors/entities/account/AccountNotFoundError";
import { StockOrderNotFoundError } from "../../../../domain/errors/entities/stock-order/StockOrderNotFoundError";
import { StockOrderStatusEnum } from "../../../../domain/enums/StockOrderStatusEnum";
import { StockOrderTypeEnum } from "../../../../domain/enums/StockOrderTypeEnum";
import { StockOrderModel } from "../models/StockOrderModel";
import { UserModel } from "../models/UserModel";
import { StockModel } from "../models/StockModel";
import { AccountModel } from "../models/AccountModel";
import { getNextSequence } from "../models/CounterModel";
import { AbstractMongoRepository } from "./AbstractMongoRepository";

export class MongodbStockOrderRepository extends AbstractMongoRepository implements StockOrderRepositoryInterface {
  public async create(
    stockOrder: StockOrder
  ): Promise<
    StockOrder | StockNotFoundError | UserNotFoundError | AccountNotFoundError
  > {
    try {
      await this.ensureConnection();

      const maybeUser = await UserModel.findOne({ id: stockOrder.ownerId });
      if (!maybeUser) {
        return new UserNotFoundError("User not found.");
      }

      const maybeStock = await StockModel.findOne({ id: stockOrder.stockId });
      if (!maybeStock) {
        return new StockNotFoundError("Stock not found.");
      }

      const maybeAccount = await AccountModel.findOne({
        id: stockOrder.accountId,
      });
      if (!maybeAccount) {
        return new AccountNotFoundError("Account not found.");
      }

      const nextId = await getNextSequence("stock_order_id");

      const createdStockOrder = await StockOrderModel.create({
        id: nextId,
        amount: stockOrder.amount,
        type: stockOrder.type,
        status: stockOrder.status,
        purchasePrice: stockOrder.purchasePrice,
        ownerId: stockOrder.ownerId,
        stockId: stockOrder.stockId,
        accountId: stockOrder.accountId,
      });

      const maybeStockOrder = StockOrder.from({
        id: createdStockOrder.id,
        amount: createdStockOrder.amount,
        type: createdStockOrder.type,
        status: createdStockOrder.status,
        purchasePrice: createdStockOrder.purchasePrice,
        ownerId: createdStockOrder.ownerId,
        stockId: createdStockOrder.stockId,
        accountId: createdStockOrder.accountId,
      });

      if (maybeStockOrder instanceof Error) {
        throw maybeStockOrder;
      }

      return maybeStockOrder;
    } catch (error) {
      return new UserNotFoundError("User not found.");
    }
  }

  public async findById(
    id: number
  ): Promise<StockOrder | StockOrderNotFoundError> {
    try {
      await this.ensureConnection();

      const foundStockOrder = await StockOrderModel.findOne({ id });

      if (!foundStockOrder) {
        return new StockOrderNotFoundError("StockOrder not found.");
      }

      const maybeStockOrder = StockOrder.from({
        id: foundStockOrder.id,
        amount: foundStockOrder.amount,
        type: foundStockOrder.type,
        status: foundStockOrder.status,
        purchasePrice: foundStockOrder.purchasePrice,
        ownerId: foundStockOrder.ownerId,
        stockId: foundStockOrder.stockId,
        accountId: foundStockOrder.accountId,
      });

      if (maybeStockOrder instanceof Error) {
        throw maybeStockOrder;
      }

      return maybeStockOrder;
    } catch (error) {
      return new StockOrderNotFoundError("StockOrder not found");
    }
  }

  public async findAllByOwner(ownerId: number): Promise<StockOrder[]> {
    try {
      await this.ensureConnection();

      const foundStockOrders = await StockOrderModel.find({ ownerId });

      const stockOrders: StockOrder[] = [];

      foundStockOrders.forEach((foundStockOrder) => {
        const maybeStockOrder = StockOrder.from({
          id: foundStockOrder.id,
          amount: foundStockOrder.amount,
          type: foundStockOrder.type,
          status: foundStockOrder.status,
          purchasePrice: foundStockOrder.purchasePrice,
          ownerId: foundStockOrder.ownerId,
          stockId: foundStockOrder.stockId,
          accountId: foundStockOrder.accountId,
        });

        if (maybeStockOrder instanceof Error) {
          throw maybeStockOrder;
        }

        stockOrders.push(maybeStockOrder);
      });

      return stockOrders;
    } catch (error) {
      return [];
    }
  }

  public async findMatchByStock(
    stockId: number,
    type: StockOrderTypeEnum
  ): Promise<StockOrder[]> {
    try {
      await this.ensureConnection();

      const foundStockOrders = await StockOrderModel.find({
        status: StockOrderStatusEnum.PENDING,
        type,
        stockId,
      });

      const stockOrders: StockOrder[] = [];

      foundStockOrders.forEach((foundStockOrder) => {
        const maybeStockOrder = StockOrder.from({
          id: foundStockOrder.id,
          amount: foundStockOrder.amount,
          type: foundStockOrder.type,
          status: foundStockOrder.status,
          purchasePrice: foundStockOrder.purchasePrice,
          ownerId: foundStockOrder.ownerId,
          stockId: foundStockOrder.stockId,
          accountId: foundStockOrder.accountId,
        });

        if (maybeStockOrder instanceof Error) {
          throw maybeStockOrder;
        }

        stockOrders.push(maybeStockOrder);
      });

      return stockOrders;
    } catch (error) {
      return [];
    }
  }

  public async findCompletedByStock(stockId: number): Promise<StockOrder[]> {
    try {
      await this.ensureConnection();

      const foundStockOrders = await StockOrderModel.find({
        status: StockOrderStatusEnum.COMPLETED,
        stockId,
      });

      const stockOrders: StockOrder[] = [];

      foundStockOrders.forEach((foundStockOrder) => {
        const maybeStockOrder = StockOrder.from({
          id: foundStockOrder.id,
          amount: foundStockOrder.amount,
          type: foundStockOrder.type,
          status: foundStockOrder.status,
          purchasePrice: foundStockOrder.purchasePrice,
          ownerId: foundStockOrder.ownerId,
          stockId: foundStockOrder.stockId,
          accountId: foundStockOrder.accountId,
        });

        if (maybeStockOrder instanceof Error) {
          throw maybeStockOrder;
        }

        stockOrders.push(maybeStockOrder);
      });

      return stockOrders;
    } catch (error) {
      return [];
    }
  }

  public async update(
    stockOrder: UpdateStockOrderPayload
  ): Promise<StockOrder | StockOrderNotFoundError> {
    try {
      await this.ensureConnection();

      const { id, ...toUpdate } = stockOrder;

      const updatedStockOrder = await StockOrderModel.findOneAndUpdate(
        { id },
        toUpdate,
        { new: true }
      );

      if (!updatedStockOrder) {
        return new StockOrderNotFoundError("StockOrder not found.");
      }

      return await this.findById(id);
    } catch (error) {
      return new StockOrderNotFoundError("StockOrder not found.");
    }
  }

  public async delete(id: number): Promise<boolean | StockOrderNotFoundError> {
    try {
      await this.ensureConnection();

      const deletedStockOrder = await StockOrderModel.findOneAndDelete({ id });

      if (!deletedStockOrder) {
        return new StockOrderNotFoundError("StockOrder not found.");
      }

      return true;
    } catch (error) {
      return new StockOrderNotFoundError("StockOrder not found.");
    }
  }
}
