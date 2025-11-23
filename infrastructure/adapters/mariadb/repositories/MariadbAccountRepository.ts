import { AccountRepositoryInterface, UpdateAccountPayload } from "../../../../application/repositories/AccountRepositoryInterface";
import { Account } from "../../../../domain/entities/Account";
import { AccountNotFoundError } from "../../../../domain/errors/entities/account/AccountNotFoundError";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { databaseDsn } from "../../../express/utils/tools";
import { MariadbConnection } from "../config/MariadbConnection";
import { AccountModel } from "../models/AccountModel";
import { UserModel } from "../models/UserModel";
import { IbanExistsError } from "../../../../domain/errors/entities/account/IbanExistsError";
import { IbanValue } from "../../../../domain/values/IbanValue";
import { UserAlreadyHaveSavingsAccountError } from "../../../../domain/errors/entities/account/UserAlreadyHaveSavingsAccountError";
import { Sequelize } from "sequelize";

export class MariadbAccountRepository implements AccountRepositoryInterface {
  private accountModel: AccountModel;

  public constructor() {
    const connection = new MariadbConnection(databaseDsn).getConnection();
    const userModel = new UserModel(connection);
    this.accountModel = new AccountModel(connection, userModel);
  }

  public async create(account: Account): Promise<Account | IbanExistsError | UserNotFoundError | UserAlreadyHaveSavingsAccountError> {
    try {
      if (account.isSavings) {
        const maybeAccount = await this.findSavingsAccountByOwner(account.ownerId);
        if (maybeAccount instanceof Account) {
          return new UserAlreadyHaveSavingsAccountError('User already has a savings account.');
        }
      }

      const createdAccount = await this.accountModel.model.create({
        iban: account.iban.value,
        name: account.name,
        ownerId: account.ownerId,
        isSavings: account.isSavings,
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

  public async update(account: UpdateAccountPayload): Promise<Account | AccountNotFoundError> {
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

  public async findSavingsAccountByOwner(ownerId: number): Promise<Account | AccountNotFoundError> {
    try {
      const foundAccount = await this.accountModel.model.findOne({
        where: {
          ownerId: ownerId,
          isSavings: true,
        },
      });

      if (!foundAccount) {
        return new AccountNotFoundError('Savings account not found.');
      }

      const maybeAccount = Account.from(foundAccount);
      if (maybeAccount instanceof Error) {
        throw maybeAccount;
      }

      return maybeAccount;
    } catch (error) {
      throw new AccountNotFoundError('Savings account not found.');
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

  public async findSavingsAccountOwnerIds(): Promise<number[]> {
    const ownerIds = await this.accountModel.model.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('ownerId')), 'ownerId'],
      ],
      where: {
        isSavings: true,
      },
    });

    return ownerIds.map((record) => record.ownerId || null).filter((id) => id !== null);
  }

  public async findAllSavingsAccounts(): Promise<Account[]> {
    const foundAccounts = await this.accountModel.model.findAll({
      where: {
        isSavings: true,
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
}
