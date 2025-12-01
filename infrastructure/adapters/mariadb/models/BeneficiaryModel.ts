import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelCtor,
  Sequelize,
} from "sequelize";
import { UserModel } from "./UserModel";
import { AccountModel } from "./AccountModel";

interface BeneficiaryModelInterface
  extends Model<
    InferAttributes<BeneficiaryModelInterface>,
    InferCreationAttributes<BeneficiaryModelInterface>
  > {
  id: CreationOptional<number>;
  name: string;
  ownerId?: number;
  accountId?: number;
  account?: any;
  owner?: any;
}

export class BeneficiaryModel {
  public model: ModelCtor<BeneficiaryModelInterface>;

  public constructor(
    connection: Sequelize,
    userModel: UserModel,
    accountModel: AccountModel
  ) {
    this.model = connection.define<BeneficiaryModelInterface>("beneficiary", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    this.associate(userModel, accountModel);
  }

  private associate(userModel: UserModel, accountModel: AccountModel) {
    this.model.belongsTo(userModel.model, {
      foreignKey: "ownerId",
      as: "owner",
    });
    this.model.belongsTo(accountModel.model, {
      foreignKey: "accountId",
      as: "account",
    });
  }
}
