import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor, Sequelize } from "sequelize";
import { UserModel } from "./UserModel";

interface CompanyChannelModelInterface extends Model<InferAttributes<CompanyChannelModelInterface>, InferCreationAttributes<CompanyChannelModelInterface>> {
  id: CreationOptional<number>;
  title: string;
}

export class CompanyChannelModel {
  public model: ModelCtor<CompanyChannelModelInterface>;

  public constructor(connection: Sequelize, userModel: UserModel) {
    this.model = connection.define<CompanyChannelModelInterface>('company_channel', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  }
}

