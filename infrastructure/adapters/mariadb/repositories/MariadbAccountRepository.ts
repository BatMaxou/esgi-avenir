import { AccountRepositoryInterface } from "../../../../application/repositories/AccountRepositoryInterface";
import { Account } from "../../../../domain/entities/Account";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { databaseDsn } from "../../../express/utils/tools";
import { MariadbConnection } from "../config/MariadbConnection";
import { AccountModel } from "../models/AccountModel";
import { UserModel } from "../models/UserModel";

export class MariadbAccountRepository implements AccountRepositoryInterface {
  private accountModel: AccountModel;

  public constructor() {
    const userModel = new UserModel(new MariadbConnection(databaseDsn).getConnection());
    this.accountModel = new AccountModel(new MariadbConnection(databaseDsn).getConnection(), userModel);
  }

  public async create(account: Account): Promise<Account | UserNotFoundError> {
    try {
      const createdAccount = await this.accountModel.model.create({
        iban: account.iban,
        name: account.name,
        ownerId: account.ownerId,
      });

      const maybeAccount = Account.from(createdAccount);
      if (maybeAccount instanceof Error) {
        throw maybeAccount;
      }

      return maybeAccount;
    } catch (error) {
      // TODO sequelize foreign key error handling ??
      throw error;
    }
  }
}
