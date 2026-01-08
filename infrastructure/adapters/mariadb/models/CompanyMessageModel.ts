import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor, Sequelize } from "sequelize";
import { UserModel } from "./UserModel";
import { CompanyChannelModel } from "./CompanyChannelModel";

interface CompanyMessageModelInterface extends Model<InferAttributes<CompanyMessageModelInterface>, InferCreationAttributes<CompanyMessageModelInterface>> {
  id: CreationOptional<number>;
  content: string;
  createdAt: CreationOptional<Date>;
  userId?: number;
  channelId?: number;
}

export class CompanyMessageModel {
  public model: ModelCtor<CompanyMessageModelInterface>;

  public constructor(connection: Sequelize, userModel: UserModel, companyChannelModel: CompanyChannelModel) {
    this.model = connection.define<CompanyMessageModelInterface>('company_message', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    this.associate(userModel, companyChannelModel);
  }

  private associate(userModel: UserModel, companyChannelModel: CompanyChannelModel) {
    this.model.belongsTo(userModel.model, {
      foreignKey: 'userId',
      as: 'user',
    });
    this.model.belongsTo(companyChannelModel.model, {
      foreignKey: 'channelId',
      as: 'channel',
    });
  }
}

