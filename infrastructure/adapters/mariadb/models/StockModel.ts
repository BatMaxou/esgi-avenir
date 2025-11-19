import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor, Sequelize } from "sequelize";

interface StockModelInterface extends Model<InferAttributes<StockModelInterface>, InferCreationAttributes<StockModelInterface>> {
  id: CreationOptional<number>;
  name: string,
  baseQuantity: number,
  basePrice: number,
  disabled: boolean,
}

export class StockModel {
  public model: ModelCtor<StockModelInterface>;

  public constructor(connection: Sequelize) {
    this.model = connection.define<StockModelInterface>('stock', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      baseQuantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      basePrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  }
}

