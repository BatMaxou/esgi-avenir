import { AccountRepositoryInterface } from "../../../../application/repositories/AccountRepositoryInterface";
import { Account } from "../../../../domain/entities/Account";
import { AccountNotFoundError } from "../../../../domain/errors/entities/account/AccountNotFoundError";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { databaseDsn } from "../../../express/utils/tools";
import { MariadbConnection } from "../config/MariadbConnection";
import { AccountModel } from "../models/AccountModel";
import { UserModel } from "../models/UserModel";
import { IbanExistsError } from "../../../../domain/errors/entities/account/IbanExistsError";
import { IbanValue } from "../../../../domain/values/IbanValue";

export class MariadbAccountRepository implements AccountRepositoryInterface {
  private accountModel: AccountModel;

  public constructor() {
    const userModel = new UserModel(new MariadbConnection(databaseDsn).getConnection());
    this.accountModel = new AccountModel(new MariadbConnection(databaseDsn).getConnection(), userModel);
  }

  public async create(account: Account): Promise<Account | IbanExistsError | UserNotFoundError> {
    try {
      const createdAccount = await this.accountModel.model.create({
        iban: account.iban.value,
        name: account.name,
        ownerId: account.ownerId,
      });

      const maybeAccount = Account.from(createdAccount);
      if (maybeAccount instanceof Error) {
        throw maybeAccount;
      }

      return maybeAccount;
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
        return new IbanExistsError(`The IBAN ${account.iban} already exists.`);
      }

      if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
        return new UserNotFoundError('User not found.');
      }

      throw new UserNotFoundError('User not found.');
    }
  }

  public async update(account: Omit<Partial<Account>, 'iban'> & { id: number }): Promise<Account | AccountNotFoundError> {
    try {
      const { id, ...toUpdate } = account;

      await this.accountModel.model.update({
        ...toUpdate,
      }, {
        where: { id },
      });

      return await this.findById(id);
    } catch (error) {
      throw new AccountNotFoundError('Account not found.');
    }
  }

  public async findAllByOwner(ownerId: number): Promise<Account[]> {
    const foundAccounts = await this.accountModel.model.findAll({
      where: {
        ownerId: ownerId,
      },
    });

    const accounts: Account[] = [];

    foundAccounts.forEach((foundAccount) => {
      const maybeAccount = Account.from(foundAccount);
      if (maybeAccount instanceof Error) {
        throw maybeAccount;
      }

      accounts.push(maybeAccount);
    });

    return accounts;
  }

  public async findById(id: number): Promise<Account | AccountNotFoundError> {
    try {
      const foundAccount = await this.accountModel.model.findByPk(id);
      if (!foundAccount) {
        return new AccountNotFoundError('Account not found.');
      }

      const maybeAccount = Account.from(foundAccount);
      if (maybeAccount instanceof Error) {
        throw maybeAccount;
      }

      return maybeAccount;
    } catch (error) {
      throw new AccountNotFoundError('Account not found');
    }
  }

  public async findByIban(iban: IbanValue): Promise<Account | AccountNotFoundError> {
    try {
      const foundAccount = await this.accountModel.model.findOne({ where: { iban: iban.value } });
      if (!foundAccount) {
        return new AccountNotFoundError('Account not found.');
      }

      const maybeAccount = Account.from(foundAccount);
      if (maybeAccount instanceof Error) {
        throw maybeAccount;
      }

      return maybeAccount;
    } catch (error) {
      throw new AccountNotFoundError('Account not found');
    }
  }

  public async findNextId(): Promise<number> {
    const foundAccount = await this.accountModel.model.findOne({
      order: [['id', 'DESC']],
    });

    if (!foundAccount) {
      return 1;
    }

    return foundAccount.id +1;
  }

  public async delete(id: number): Promise<boolean | AccountNotFoundError> {
    try {
      const deletedCount = await this.accountModel.model.destroy({ where: { id } });
      if (deletedCount === 0) {
        return new AccountNotFoundError('Account not found.');
      }

      return true;
    } catch (error) {
      throw new AccountNotFoundError('Account not found.');
    }
  }
}
