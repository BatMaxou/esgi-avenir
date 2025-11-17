import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor, Sequelize } from "sequelize";
import { StockOrderStatusEnum } from "../../../../domain/enums/StockOrderStatusEnum";
import { StockOrderTypeEnum } from "../../../../domain/enums/StockOrderTypeEnum";
import { StockModel } from "./StockModel";
import { UserModel } from "./UserModel";

interface StockOrderModelInterface extends Model<InferAttributes<StockOrderModelInterface>, InferCreationAttributes<StockOrderModelInterface>> {
  id: CreationOptional<number>;
  amount: number,
  type: StockOrderTypeEnum,
  status: StockOrderStatusEnum,
  ownerId?: number,
  stockId?: number,
}

export class StockOrderModel {
  public model: ModelCtor<StockOrderModelInterface>;

  public constructor(connection: Sequelize, userModel: UserModel, stockModel: StockModel) {
    this.model = connection.define<StockOrderModelInterface>('stock_order', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(StockOrderTypeEnum)),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(StockOrderStatusEnum)),
        allowNull: false,
      },
    });

    this.associate(userModel, stockModel);
  }

  private associate(userModel: UserModel, stockModel: StockModel) {
    this.model.belongsTo(userModel.model, {
      foreignKey: 'ownerId',
    });
    this.model.belongsTo(stockModel.model, {
      foreignKey: 'stockId',
    });
  }
}

