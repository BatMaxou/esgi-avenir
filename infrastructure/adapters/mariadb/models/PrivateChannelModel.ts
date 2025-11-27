import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor, Sequelize } from "sequelize";
import { UserModel } from "./UserModel";

interface PrivateChannelModelInterface extends Model<InferAttributes<PrivateChannelModelInterface>, InferCreationAttributes<PrivateChannelModelInterface>> {
  id: CreationOptional<number>;
  title: string;
  userId?: number;
  advisorId?: number;
}

export class PrivateChannelModel {
  public model: ModelCtor<PrivateChannelModelInterface>;

  public constructor(connection: Sequelize, userModel: UserModel) {
    this.model = connection.define<PrivateChannelModelInterface>('private_channel', {
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

    this.associate(userModel);
  }

  private associate(userModel: UserModel) {
    this.model.belongsTo(userModel.model, {
      foreignKey: 'userId',
      as: 'user',
    });
    this.model.belongsTo(userModel.model, {
      foreignKey: 'advisorId',
      as: 'advisor',
    });
  }
}

