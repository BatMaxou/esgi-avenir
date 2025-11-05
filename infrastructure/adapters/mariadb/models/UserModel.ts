import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor, Sequelize } from "sequelize";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";

interface UserModelInterface extends Model<InferAttributes<UserModelInterface>, InferCreationAttributes<UserModelInterface>> {
  id: CreationOptional<number>;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string | RoleEnum[];
  enabled?: CreationOptional<boolean>;
  confirmationToken?: CreationOptional<string | null>;
}

export class UserModel {
  public model: ModelCtor<UserModelInterface>;

  public constructor(connection: Sequelize) {
    this.model = connection.define<UserModelInterface>('user', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      roles: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      confirmationToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    })
  }
}
