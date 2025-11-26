import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor, Sequelize } from "sequelize";
import { UserModel } from "./UserModel";

interface NewsModelInterface extends Model<InferAttributes<NewsModelInterface>, InferCreationAttributes<NewsModelInterface>> {
  id: CreationOptional<number>;
  title: string;
  content: string;
  createdAt: CreationOptional<Date>;
  authorId?: number;
}

export class NewsModel {
  public model: ModelCtor<NewsModelInterface>;

  public constructor(connection: Sequelize, userModel: UserModel) {
    this.model = connection.define<NewsModelInterface>('news', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
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

    this.associate(userModel);
  }

  private associate(userModel: UserModel) {
    this.model.belongsTo(userModel.model, {
      foreignKey: 'authorId',
      as: 'author',
    });
  }
}

