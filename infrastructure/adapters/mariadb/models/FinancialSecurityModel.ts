import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor, Sequelize } from "sequelize";
import { StockModel } from "./StockModel";
import { UserModel } from "./UserModel";

interface FinancialSecurityModelInterface extends Model<InferAttributes<FinancialSecurityModelInterface>, InferCreationAttributes<FinancialSecurityModelInterface>> {
  id: CreationOptional<number>;
  purchasePrice: number,
  ownerId?: number,
  stockId?: number,
}

export class FinancialSecurityModel {
  public model: ModelCtor<FinancialSecurityModelInterface>;

  public constructor(connection: Sequelize, userModel: UserModel, stockModel: StockModel) {
    this.model = connection.define<FinancialSecurityModelInterface>('financial_security', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      purchasePrice: {
        type: DataTypes.FLOAT,
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

