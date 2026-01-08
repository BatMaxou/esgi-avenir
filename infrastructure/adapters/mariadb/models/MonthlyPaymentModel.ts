import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor, Sequelize } from "sequelize";
import { BankCreditModel } from "./BankCreditModel";

interface MonthlyPaymentModelInterface extends Model<InferAttributes<MonthlyPaymentModelInterface>, InferCreationAttributes<MonthlyPaymentModelInterface>> {
  id: CreationOptional<number>;
  amount: number;
  createdAt: CreationOptional<Date>;
  bankCreditId?: number;
}

export class MonthlyPaymentModel {
  public model: ModelCtor<MonthlyPaymentModelInterface>;

  public constructor(connection: Sequelize, bankCreditModel: BankCreditModel) {
    this.model = connection.define<MonthlyPaymentModelInterface>('monthly_payment', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    this.associate(bankCreditModel);
  }

  private associate(bankCreditModel: BankCreditModel) {
    this.model.belongsTo(bankCreditModel.model, {
      foreignKey: 'bankCreditId',
    });
  }
}

