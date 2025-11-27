import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor, Sequelize } from "sequelize";
import { UserModel } from "./UserModel";

interface NotificationModelInterface extends Model<InferAttributes<NotificationModelInterface>, InferCreationAttributes<NotificationModelInterface>> {
  id: CreationOptional<number>;
  content: string;
  advisorId?: number,
  userId?: number;
}

export class NotificationModel {
  public model: ModelCtor<NotificationModelInterface>;

  public constructor(connection: Sequelize, userModel: UserModel) {
    this.model = connection.define<NotificationModelInterface>('notification', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    this.associate(userModel);
  }

  private associate(userModel: UserModel) {
    this.model.belongsTo(userModel.model, {
      foreignKey: 'advisorId',
      as: 'advisor',
    });
    this.model.belongsTo(userModel.model, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}

