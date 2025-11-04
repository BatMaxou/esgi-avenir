import { Sequelize } from "sequelize";

import { UserModel } from "../../adapters/mariadb/models/UserModel";

export const initModels = (connection: Sequelize) => {
  new UserModel(connection).model;
};
