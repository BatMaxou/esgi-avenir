import { Sequelize } from "sequelize";

import { UserModel } from "./models/UserModel";
import { AccountModel } from "./models/AccountModel";
import { OperationModel } from "./models/OperationModel";

export const initModels = (connection: Sequelize) => {
  const userModel = new UserModel(connection);
  const accountModel = new AccountModel(connection, userModel);
  new OperationModel(connection, accountModel);
};
