import {
  AccountRepositoryInterface,
  UpdateAccountPayload,
} from "../../../../application/repositories/AccountRepositoryInterface";
import { Account } from "../../../../domain/entities/Account";
import { AccountNotFoundError } from "../../../../domain/errors/entities/account/AccountNotFoundError";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { IbanExistsError } from "../../../../domain/errors/entities/account/IbanExistsError";
import { IbanValue } from "../../../../domain/values/IbanValue";
import { UserAlreadyHaveSavingsAccountError } from "../../../../domain/errors/entities/account/UserAlreadyHaveSavingsAccountError";
import { AccountModel } from "../models/AccountModel";
import { UserModel } from "../models/UserModel";
import { getNextSequence } from "../models/CounterModel";
import { AbstractMongoRepository } from "./AbstractMongoRepository";

export class MongodbAccountRepository extends AbstractMongoRepository implements AccountRepositoryInterface {
  public async create(
    account: Account
  ): Promise<
    | Account
    | IbanExistsError
    | UserNotFoundError
    | UserAlreadyHaveSavingsAccountError
  > {
    try {
      await this.ensureConnection();

      if (account.isSavings) {
        const maybeAccount = await this.findSavingsAccountByOwner(
          account.ownerId
        );
        if (maybeAccount instanceof Account) {
          return new UserAlreadyHaveSavingsAccountError(
            "User already has a savings account."
          );
        }
      }

      const existingAccount = await AccountModel.findOne({
        iban: account.iban.value,
      });
      if (existingAccount) {
        return new IbanExistsError(`The IBAN ${account.iban} already exists.`);
      }

      const existingUser = await UserModel.findOne({ id: account.ownerId });
      if (!existingUser) {
        return new UserNotFoundError("User not found.");
      }

      const nextId = await getNextSequence("account_id");

      const createdAccount = await AccountModel.create({
        id: nextId,
        iban: account.iban.value,
        name: account.name,
        ownerId: account.ownerId,
        isSavings: account.isSavings,
        isDeleted: account.isDeleted,
      });

      const maybeAccount = Account.from({
        id: createdAccount.id,
        iban: createdAccount.iban,
        name: createdAccount.name,
        ownerId: createdAccount.ownerId,
        isSavings: createdAccount.isSavings,
        isDeleted: createdAccount.isDeleted,
      });

      if (maybeAccount instanceof Error) {
        throw maybeAccount;
      }

      return maybeAccount;
    } catch (error) {
      if (error instanceof Error && error.message.includes("E11000")) {
        return new IbanExistsError(`The IBAN ${account.iban} already exists.`);
      }

      return new UserNotFoundError("User not found.");
    }
  }

  public async update(
    account: UpdateAccountPayload
  ): Promise<Account | AccountNotFoundError> {
    try {
      await this.ensureConnection();

      const { id, isDeleted, ...toUpdate } = account;

      if (isDeleted) {
        return new AccountNotFoundError("Account not found.");
      }

      const updatedAccount = await AccountModel.findOneAndUpdate(
        { id },
        toUpdate,
        { new: true }
      );

      if (!updatedAccount) {
        return new AccountNotFoundError("Account not found.");
      }

      return await this.findById(id);
    } catch (error) {
      return new AccountNotFoundError("Account not found.");
    }
  }

  public async findSavingsAccountByOwner(
    ownerId: number
  ): Promise<Account | AccountNotFoundError> {
    try {
      await this.ensureConnection();

      const foundAccount = await AccountModel.findOne({
        ownerId: ownerId,
        isSavings: true,
        isDeleted: false,
      });

      if (!foundAccount) {
        return new AccountNotFoundError("Savings account not found.");
      }

      const maybeAccount = Account.from({
        id: foundAccount.id,
        iban: foundAccount.iban,
        name: foundAccount.name,
        ownerId: foundAccount.ownerId,
        isSavings: foundAccount.isSavings,
        isDeleted: foundAccount.isDeleted,
      });

      if (maybeAccount instanceof Error) {
        throw maybeAccount;
      }

      return maybeAccount;
    } catch (error) {
      return new AccountNotFoundError("Savings account not found.");
    }
  }

  public async findAllByOwner(ownerId: number): Promise<Account[]> {
    try {
      await this.ensureConnection();

      const foundAccounts = await AccountModel.find({
        ownerId: ownerId,
        isDeleted: false,
      });

      const accounts: Account[] = [];

      foundAccounts.forEach((foundAccount) => {
        const maybeAccount = Account.from({
          id: foundAccount.id,
          iban: foundAccount.iban,
          name: foundAccount.name,
          ownerId: foundAccount.ownerId,
          isSavings: foundAccount.isSavings,
          isDeleted: foundAccount.isDeleted,
        });

        if (maybeAccount instanceof Error) {
          throw maybeAccount;
        }

        accounts.push(maybeAccount);
      });

      return accounts;
    } catch (error) {
      return [];
    }
  }

  public async findById(id: number): Promise<Account | AccountNotFoundError> {
    try {
      await this.ensureConnection();

      const foundAccount = await AccountModel.findOne({ id });

      if (!foundAccount || foundAccount.isDeleted) {
        return new AccountNotFoundError("Account not found.");
      }

      const maybeAccount = Account.from({
        id: foundAccount.id,
        iban: foundAccount.iban,
        name: foundAccount.name,
        ownerId: foundAccount.ownerId,
        isSavings: foundAccount.isSavings,
        isDeleted: foundAccount.isDeleted,
      });

      if (maybeAccount instanceof Error) {
        throw maybeAccount;
      }

      return maybeAccount;
    } catch (error) {
      return new AccountNotFoundError("Account not found");
    }
  }

  public async findByIban(
    iban: IbanValue
  ): Promise<Account | AccountNotFoundError> {
    try {
      await this.ensureConnection();

      const foundAccount = await AccountModel.findOne({ iban: iban.value });

      if (!foundAccount) {
        return new AccountNotFoundError("Account not found.");
      }

      const maybeAccount = Account.from({
        id: foundAccount.id,
        iban: foundAccount.iban,
        name: foundAccount.name,
        ownerId: foundAccount.ownerId,
        isSavings: foundAccount.isSavings,
        isDeleted: foundAccount.isDeleted,
      });

      if (maybeAccount instanceof Error) {
        throw maybeAccount;
      }

      return maybeAccount;
    } catch (error) {
      return new AccountNotFoundError("Account not found");
    }
  }

  public async findNextId(): Promise<number> {
    await this.ensureConnection();

    const foundAccount = await AccountModel.findOne().sort({ id: -1 });

    if (!foundAccount) {
      return 1;
    }

    return foundAccount.id + 1;
  }

  public async delete(id: number): Promise<boolean | AccountNotFoundError> {
    try {
      await this.ensureConnection();

      const result = await AccountModel.findOneAndUpdate(
        { id },
        { isDeleted: true },
        { new: true }
      );

      if (!result) {
        return new AccountNotFoundError("Account not found.");
      }

      return true;
    } catch (error) {
      return new AccountNotFoundError("Account not found.");
    }
  }

  public async findSavingsAccountOwnerIds(): Promise<number[]> {
    await this.ensureConnection();

    const accounts = await AccountModel.find({
      isSavings: true,
      isDeleted: false,
    }).distinct("ownerId");

    return accounts;
  }

  public async findAllSavingsAccounts(): Promise<Account[]> {
    try {
      await this.ensureConnection();

      const foundAccounts = await AccountModel.find({
        isSavings: true,
        isDeleted: false,
      });

      const accounts: Account[] = [];

      foundAccounts.forEach((foundAccount) => {
        const maybeAccount = Account.from({
          id: foundAccount.id,
          iban: foundAccount.iban,
          name: foundAccount.name,
          ownerId: foundAccount.ownerId,
          isSavings: foundAccount.isSavings,
          isDeleted: foundAccount.isDeleted,
        });

        if (maybeAccount instanceof Error) {
          throw maybeAccount;
        }

        accounts.push(maybeAccount);
      });

      return accounts;
    } catch (error) {
      return [];
    }
  }
}
