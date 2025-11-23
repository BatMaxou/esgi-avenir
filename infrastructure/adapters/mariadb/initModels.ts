import { Sequelize } from "sequelize";

import { UserModel } from "./models/UserModel";
import { AccountModel } from "./models/AccountModel";
import { OperationModel } from "./models/OperationModel";
import { SettingModel } from "./models/SettingModel";
import { StockModel } from "./models/StockModel";
import { StockOrderModel } from "./models/StockOrderModel";
import { FinancialSecurityModel } from "./models/FinancialSecurityModel";
import { BeneficiaryModel } from "./models/BeneficiaryModel";

export const initModels = (connection: Sequelize) => {
  const userModel = new UserModel(connection);
  const accountModel = new AccountModel(connection, userModel);
  const stockModel = new StockModel(connection);

  new OperationModel(connection, accountModel);
  new SettingModel(connection);
  new StockOrderModel(connection, userModel, stockModel, accountModel);
  new FinancialSecurityModel(connection, userModel, stockModel);
  new BeneficiaryModel(connection, userModel, accountModel);
};
