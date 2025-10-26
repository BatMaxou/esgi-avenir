import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelCtor, Sequelize } from "sequelize";
import { User } from "../../../../domain/entities/User";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { MariadbConnection } from "../config/MariadbConnection";

interface UserModelInterface extends Model<InferAttributes<UserModelInterface>, InferCreationAttributes<UserModelInterface>> {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: RoleEnum[];
}

export class UserModel {
  public model: ModelCtor<UserModelInterface>;

  public constructor(connection: Sequelize) {
    this.model = connection.define<UserModelInterface>('user', {
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
    })
  }
}
