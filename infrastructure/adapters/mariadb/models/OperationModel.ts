import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor, Sequelize } from "sequelize";
import { AccountModel } from "./AccountModel";
import { OperationEnum } from "../../../../domain/enums/OperationEnum";

interface OperationModelInterface extends Model<InferAttributes<OperationModelInterface>, InferCreationAttributes<OperationModelInterface>> {
  id: CreationOptional<number>;
  amount: number;
  type: OperationEnum;
  name?: string;
  createdAt: CreationOptional<Date>;
  fromId?: number;
  toId?: number;
}

export class OperationModel {
  public model: ModelCtor<OperationModelInterface>;

  public constructor(connection: Sequelize, accountModel: AccountModel) {
    this.model = connection.define<OperationModelInterface>('operation', {
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
        type: DataTypes.ENUM(...Object.values(OperationEnum)),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    this.associate(accountModel);
  }

  private associate(accountModel: AccountModel) {
    this.model.belongsTo(accountModel.model, {
      foreignKey: 'fromId',
    });
    this.model.belongsTo(accountModel.model, {
      foreignKey: 'toId',
    });
  }
}

