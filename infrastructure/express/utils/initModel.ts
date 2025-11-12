import { Sequelize } from "sequelize";

import { UserModel } from "../../adapters/mariadb/models/UserModel";
import { AccountModel } from "../../adapters/mariadb/models/AccountModel";

export const initModels = (connection: Sequelize) => {
  const userModel = new UserModel(connection);
  new AccountModel(connection, userModel);
};
