import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor, Sequelize } from "sequelize";
import { SettingEnum } from "../../../../domain/enums/SettingEnum";

interface SettingModelInterface extends Model<InferAttributes<SettingModelInterface>, InferCreationAttributes<SettingModelInterface>> {
  id: CreationOptional<number>;
  code:  SettingEnum;
  value: string | number | boolean;
}

export class SettingModel {
  public model: ModelCtor<SettingModelInterface>;

  public constructor(connection: Sequelize) {
    this.model = connection.define<SettingModelInterface>('setting', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: DataTypes.ENUM(...Object.values(SettingEnum)),
        unique: true,
        allowNull: false,
      },
      value: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    });
  }
}

