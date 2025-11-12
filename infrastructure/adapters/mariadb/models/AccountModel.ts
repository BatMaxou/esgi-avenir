import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor, Sequelize } from "sequelize";
import { UserModel } from "./UserModel";

interface AccountModelInterface extends Model<InferAttributes<AccountModelInterface>, InferCreationAttributes<AccountModelInterface>> {
  id: CreationOptional<number>;
  iban: string;
  name: string;
  ownerId?: number;
}

export class AccountModel {
  public model: ModelCtor<AccountModelInterface>;

  public constructor(connection: Sequelize, userModel: UserModel) {
    this.model = connection.define<AccountModelInterface>('account', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      iban: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    this.associate(userModel);
  }

  private associate(userModel: UserModel) {
    this.model.belongsTo(userModel.model, {
      foreignKey: 'ownerId',
    });
  }
}

