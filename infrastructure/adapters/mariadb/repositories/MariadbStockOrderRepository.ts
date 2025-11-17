import { StockOrderRepositoryInterface } from "../../../../application/repositories/StockOrderRepositoryInterface";
import { StockOrder } from "../../../../domain/entities/StockOrder";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { databaseDsn } from "../../../express/utils/tools";
import { MariadbConnection } from "../config/MariadbConnection";
import { StockOrderModel } from "../models/StockOrderModel";
import { UserModel } from "../models/UserModel";
import { StockModel } from "../models/StockModel";
import { StockNotFoundError } from "../../../../domain/errors/entities/stock/StockNotFoundError";

export class MariadbStockOrderRepository implements StockOrderRepositoryInterface {
  private stockOrderModel: StockOrderModel;

  public constructor() {
    const connection = new MariadbConnection(databaseDsn).getConnection();
    const userModel = new UserModel(connection);
    const stockModel = new StockModel(connection);
    this.stockOrderModel = new StockOrderModel(new MariadbConnection(databaseDsn).getConnection(), userModel, stockModel);
  }

  public async create(stockOrder: StockOrder): Promise<StockOrder | StockNotFoundError | UserNotFoundError> {
    try {
      const createdStockOrder = await this.stockOrderModel.model.create({
        amount: stockOrder.amount,
        type: stockOrder.type,
        status: stockOrder.status,
        ownerId: stockOrder.ownerId,
        stockId: stockOrder.stockId,
      });

      const maybeStockOrder = StockOrder.from(createdStockOrder);
      if (maybeStockOrder instanceof Error) {
        throw maybeStockOrder;
      }

      return maybeStockOrder;
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
        if (error.message.includes('ownerId')) {
          return new UserNotFoundError('User not found.');
        } else if (error.message.includes('stockId')) {
          return new StockNotFoundError('Stock not found.');
        }
      }

      throw error;
    }
  }
}
