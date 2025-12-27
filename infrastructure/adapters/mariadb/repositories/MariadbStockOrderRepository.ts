import {
  StockOrderRepositoryInterface,
  UpdateStockOrderPayload,
} from "../../../../application/repositories/StockOrderRepositoryInterface";
import { StockOrder } from "../../../../domain/entities/StockOrder";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { MariadbConnection } from "../config/MariadbConnection";
import { StockOrderModel } from "../models/StockOrderModel";
import { UserModel } from "../models/UserModel";
import { StockModel } from "../models/StockModel";
import { StockNotFoundError } from "../../../../domain/errors/entities/stock/StockNotFoundError";
import { AccountModel } from "../models/AccountModel";
import { AccountNotFoundError } from "../../../../domain/errors/entities/account/AccountNotFoundError";
import { StockOrderNotFoundError } from "../../../../domain/errors/entities/stock-order/StockOrderNotFoundError";
import { StockOrderStatusEnum } from "../../../../domain/enums/StockOrderStatusEnum";
import { StockOrderTypeEnum } from "../../../../domain/enums/StockOrderTypeEnum";

export class MariadbStockOrderRepository
  implements StockOrderRepositoryInterface
{
  private stockOrderModel: StockOrderModel;
  private stockModel: StockModel;

  public constructor(databaseDsn: string) {
    const connection = new MariadbConnection(databaseDsn).getConnection();
    const userModel = new UserModel(connection);
    const accountModel = new AccountModel(connection, userModel);
    this.stockModel = new StockModel(connection);
    this.stockOrderModel = new StockOrderModel(
      connection,
      userModel,
      this.stockModel,
      accountModel
    );
  }

  public async create(
    stockOrder: StockOrder
  ): Promise<
    StockOrder | StockNotFoundError | UserNotFoundError | AccountNotFoundError
  > {
    try {
      const createdStockOrder = await this.stockOrderModel.model.create({
        amount: stockOrder.amount,
        type: stockOrder.type,
        status: stockOrder.status,
        purchasePrice: stockOrder.purchasePrice,
        ownerId: stockOrder.ownerId,
        stockId: stockOrder.stockId,
        accountId: stockOrder.accountId,
      });

      const maybeStockOrder = StockOrder.from(createdStockOrder);
      if (maybeStockOrder instanceof Error) {
        throw maybeStockOrder;
      }

      return maybeStockOrder;
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "SequelizeForeignKeyConstraintError"
      ) {
        if (error.message.includes("ownerId")) {
          return new UserNotFoundError("User not found.");
        } else if (error.message.includes("stockId")) {
          return new StockNotFoundError("Stock not found.");
        } else if (error.message.includes("accountId")) {
          return new AccountNotFoundError("Account not found.");
        }
      }

      return new UserNotFoundError("User not found.");
    }
  }

  public async findById(
    id: number
  ): Promise<StockOrder | StockOrderNotFoundError> {
    try {
      const foundStockOrder = await this.stockOrderModel.model.findByPk(id);
      if (!foundStockOrder) {
        return new StockOrderNotFoundError("StockOrder not found.");
      }

      const maybeStockOrder = StockOrder.from(foundStockOrder);
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
      const foundStockOrders = await this.stockOrderModel.model.findAll({
        where: {
          ownerId,
        },
        include: [{ model: this.stockModel.model }],
      });

      const stockOrders: StockOrder[] = [];

      foundStockOrders.forEach((foundStockOrder) => {
        const maybeStockOrder = StockOrder.from(foundStockOrder);
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
      const foundStockOrders = await this.stockOrderModel.model.findAll({
        where: {
          status: StockOrderStatusEnum.PENDING,
          type,
          stockId,
        },
      });

      const stockOrders: StockOrder[] = [];

      foundStockOrders.forEach((foundStockOrder) => {
        const maybeStockOrder = StockOrder.from(foundStockOrder);
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
      const foundStockOrders = await this.stockOrderModel.model.findAll({
        where: {
          status: StockOrderStatusEnum.COMPLETED,
          stockId,
        },
      });

      const stockOrders: StockOrder[] = [];

      foundStockOrders.forEach((foundStockOrder) => {
        const maybeStockOrder = StockOrder.from(foundStockOrder);
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
      const { id, ...toUpdate } = stockOrder;

      await this.stockOrderModel.model.update(
        {
          ...toUpdate,
        },
        {
          where: { id },
        }
      );

      return await this.findById(id);
    } catch (error) {
      return new StockOrderNotFoundError("StockOrder not found.");
    }
  }

  public async delete(id: number): Promise<boolean | StockOrderNotFoundError> {
    try {
      const deletedCount = await this.stockOrderModel.model.destroy({
        where: { id },
      });
      if (deletedCount === 0) {
        return new StockOrderNotFoundError("StockOrder not found.");
      }

      return true;
    } catch (error) {
      return new StockOrderNotFoundError("StockOrder not found.");
    }
  }
}
