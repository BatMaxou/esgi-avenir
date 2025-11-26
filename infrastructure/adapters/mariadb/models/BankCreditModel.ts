import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor, Sequelize } from "sequelize";
import { UserModel } from "./UserModel";
import { AccountModel } from "./AccountModel";
import { BankCreditStatusEnum } from "../../../../domain/enums/BankCreditStatusEnum";

interface BankCreditModelInterface extends Model<InferAttributes<BankCreditModelInterface>, InferCreationAttributes<BankCreditModelInterface>> {
  id: CreationOptional<number>;
  amount: number;
  insurancePercentage: number;
  interestPercentage: number;
  durationInMonths: number;
  status: BankCreditStatusEnum;
  accountId?: number;
  advisorId?: number;
  ownerId?: number;
}

export class BankCreditModel {
  public model: ModelCtor<BankCreditModelInterface>;

  public constructor(connection: Sequelize, userModel: UserModel, accountModel: AccountModel) {
    this.model = connection.define<BankCreditModelInterface>('bank_credit', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      insurancePercentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      interestPercentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      durationInMonths: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(BankCreditStatusEnum)),
        allowNull: false,
      },
    });

    this.associate(userModel, accountModel);
  }

  private associate(userModel: UserModel, accountModel: AccountModel) {
    this.model.belongsTo(userModel.model, {
      foreignKey: 'advisorId',
      as: 'advisor',
    });
    this.model.belongsTo(accountModel.model, {
      foreignKey: 'accountId',
    });
    this.model.belongsTo(userModel.model, {
      foreignKey: 'ownerId',
      as: 'owner',
    });
  }
}

