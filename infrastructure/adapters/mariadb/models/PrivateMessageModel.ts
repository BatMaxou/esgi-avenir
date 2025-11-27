import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor, Sequelize } from "sequelize";
import { UserModel } from "./UserModel";
import { PrivateChannelModel } from "./PrivateChannelModel";

interface PrivateMessageModelInterface extends Model<InferAttributes<PrivateMessageModelInterface>, InferCreationAttributes<PrivateMessageModelInterface>> {
  id: CreationOptional<number>;
  content: string;
  userId?: number;
  channelId?: number;
}

export class PrivateMessageModel {
  public model: ModelCtor<PrivateMessageModelInterface>;

  public constructor(connection: Sequelize, userModel: UserModel, privateChannelModel: PrivateChannelModel) {
    this.model = connection.define<PrivateMessageModelInterface>('private_message', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    });

    this.associate(userModel, privateChannelModel);
  }

  private associate(userModel: UserModel, privateChannelModel: PrivateChannelModel) {
    this.model.belongsTo(userModel.model, {
      foreignKey: 'userId',
      as: 'user',
    });
    this.model.belongsTo(privateChannelModel.model, {
      foreignKey: 'channelId',
      as: 'channel',
    });
  }
}

