import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor, Sequelize } from "sequelize";
import { AccountModel } from "./AccountModel";
import { OperationEnum } from "../../../../domain/enums/OperationEnum";

interface OperationModelInterface extends Model<InferAttributes<OperationModelInterface>, InferCreationAttributes<OperationModelInterface>> {
  id: CreationOptional<number>;
  amount: number;
  type: OperationEnum;
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

