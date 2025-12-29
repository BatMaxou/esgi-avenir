import { BankCredit } from "../../../../domain/entities/BankCredit";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import {
  BankCreditRepositoryInterface,
  UpdateBankCreditPayload,
} from "../../../../application/repositories/BankCreditRepositoryInterface";
import { AccountNotFoundError } from "../../../../domain/errors/entities/account/AccountNotFoundError";
import { InvalidInsurancePercentageError } from "../../../../domain/errors/entities/bank-credit/InvalidInsurancePercentageError";
import { InvalidInterestPercentageError } from "../../../../domain/errors/entities/bank-credit/InvalidInterestPercentageError";
import { InvalidAmountError } from "../../../../domain/errors/entities/bank-credit/InvalidAmountError";
import { InvalidDurationInMonthsError } from "../../../../domain/errors/entities/bank-credit/InvalidDurationInMonthsError";
import { BankCreditNotFoundError } from "../../../../domain/errors/entities/bank-credit/BankCreditNotFoundError";
import { BankCreditStatusEnum } from "../../../../domain/enums/BankCreditStatusEnum";
import { BankCreditModel } from "../models/BankCreditModel";
import { UserModel } from "../models/UserModel";
import { AccountModel } from "../models/AccountModel";
import { getNextSequence } from "../models/CounterModel";
import { openConnection } from "../config/MongodbConnection";

export class MongodbBankCreditRepository
  implements BankCreditRepositoryInterface
{
  private initialized: boolean = false;

  public constructor() {
    this.ensureConnection();
  }

  private async ensureConnection(): Promise<void> {
    if (!this.initialized) {
      await openConnection();
      this.initialized = true;
    }
  }

  public async create(
    bankCredit: BankCredit
  ): Promise<
    | BankCredit
    | UserNotFoundError
    | AccountNotFoundError
    | InvalidInsurancePercentageError
    | InvalidInterestPercentageError
    | InvalidAmountError
    | InvalidDurationInMonthsError
  > {
    try {
      await this.ensureConnection();

      const maybeAdvisor = await UserModel.findOne({
        id: bankCredit.advisorId,
      });
      if (!maybeAdvisor) {
        return new UserNotFoundError("User not found.");
      }

      const maybeOwner = await UserModel.findOne({ id: bankCredit.ownerId });
      if (!maybeOwner) {
        return new UserNotFoundError("User not found.");
      }

      const maybeAccount = await AccountModel.findOne({
        id: bankCredit.accountId,
      });
      if (!maybeAccount) {
        return new AccountNotFoundError("Account not found.");
      }

      const nextId = await getNextSequence("bank_credit_id");

      const createdBankCredit = await BankCreditModel.create({
        id: nextId,
        amount: bankCredit.amount,
        insurancePercentage: bankCredit.insurancePercentage,
        interestPercentage: bankCredit.interestPercentage,
        durationInMonths: bankCredit.durationInMonths,
        status: bankCredit.status,
        accountId: bankCredit.accountId,
        advisorId: bankCredit.advisorId,
        ownerId: bankCredit.ownerId,
      });

      const maybeBankCredit = BankCredit.from({
        id: createdBankCredit.id,
        amount: createdBankCredit.amount,
        insurancePercentage: createdBankCredit.insurancePercentage,
        interestPercentage: createdBankCredit.interestPercentage,
        durationInMonths: createdBankCredit.durationInMonths,
        status: createdBankCredit.status,
        accountId: createdBankCredit.accountId,
        advisorId: createdBankCredit.advisorId,
        ownerId: createdBankCredit.ownerId,
      });

      if (maybeBankCredit instanceof Error) {
        throw maybeBankCredit;
      }

      return maybeBankCredit;
    } catch (error) {
      return new UserNotFoundError("User not found.");
    }
  }

  public async update(
    bankCredit: UpdateBankCreditPayload
  ): Promise<BankCredit | BankCreditNotFoundError> {
    try {
      await this.ensureConnection();

      const { id, ...toUpdate } = bankCredit;

      const updatedBankCredit = await BankCreditModel.findOneAndUpdate(
        { id },
        toUpdate,
        { new: true }
      );

      if (!updatedBankCredit) {
        return new BankCreditNotFoundError("BankCredit not found.");
      }

      return await this.findById(id);
    } catch (error) {
      return new BankCreditNotFoundError("BankCredit not found.");
    }
  }

  public async findById(
    id: number
  ): Promise<BankCredit | BankCreditNotFoundError> {
    try {
      await this.ensureConnection();

      const foundBankCredit = await BankCreditModel.findOne({ id });

      if (!foundBankCredit) {
        return new BankCreditNotFoundError("BankCredit not found.");
      }

      const maybeBankCredit = BankCredit.from({
        id: foundBankCredit.id,
        amount: foundBankCredit.amount,
        insurancePercentage: foundBankCredit.insurancePercentage,
        interestPercentage: foundBankCredit.interestPercentage,
        durationInMonths: foundBankCredit.durationInMonths,
        status: foundBankCredit.status,
        accountId: foundBankCredit.accountId,
        advisorId: foundBankCredit.advisorId,
        ownerId: foundBankCredit.ownerId,
      });

      if (maybeBankCredit instanceof Error) {
        throw maybeBankCredit;
      }

      return maybeBankCredit;
    } catch (error) {
      return new BankCreditNotFoundError("BankCredit not found.");
    }
  }

  public async findAllByAdvisor(advisorId: number): Promise<BankCredit[]> {
    try {
      await this.ensureConnection();

      const foundBankCredits = await BankCreditModel.find({ advisorId });

      const bankCredits: BankCredit[] = [];

      foundBankCredits.forEach((foundBankCredit) => {
        const maybeBankCredit = BankCredit.from({
          id: foundBankCredit.id,
          amount: foundBankCredit.amount,
          insurancePercentage: foundBankCredit.insurancePercentage,
          interestPercentage: foundBankCredit.interestPercentage,
          durationInMonths: foundBankCredit.durationInMonths,
          status: foundBankCredit.status,
          accountId: foundBankCredit.accountId,
          advisorId: foundBankCredit.advisorId,
          ownerId: foundBankCredit.ownerId,
        });

        if (maybeBankCredit instanceof Error) {
          throw maybeBankCredit;
        }

        bankCredits.push(maybeBankCredit);
      });

      return bankCredits;
    } catch (error) {
      return [];
    }
  }

  public async findAllByOwner(ownerId: number): Promise<BankCredit[]> {
    try {
      await this.ensureConnection();

      const foundBankCredits = await BankCreditModel.find({ ownerId });

      const bankCredits: BankCredit[] = [];

      foundBankCredits.forEach((foundBankCredit) => {
        const maybeBankCredit = BankCredit.from({
          id: foundBankCredit.id,
          amount: foundBankCredit.amount,
          insurancePercentage: foundBankCredit.insurancePercentage,
          interestPercentage: foundBankCredit.interestPercentage,
          durationInMonths: foundBankCredit.durationInMonths,
          status: foundBankCredit.status,
          accountId: foundBankCredit.accountId,
          advisorId: foundBankCredit.advisorId,
          ownerId: foundBankCredit.ownerId,
        });

        if (maybeBankCredit instanceof Error) {
          throw maybeBankCredit;
        }

        bankCredits.push(maybeBankCredit);
      });

      return bankCredits;
    } catch (error) {
      return [];
    }
  }

  public async findAllNotCompleted(): Promise<BankCredit[]> {
    try {
      await this.ensureConnection();

      const foundBankCredits = await BankCreditModel.find({
        status: BankCreditStatusEnum.APPROVED,
      });

      const bankCredits: BankCredit[] = [];

      foundBankCredits.forEach((foundBankCredit) => {
        const maybeBankCredit = BankCredit.from({
          id: foundBankCredit.id,
          amount: foundBankCredit.amount,
          insurancePercentage: foundBankCredit.insurancePercentage,
          interestPercentage: foundBankCredit.interestPercentage,
          durationInMonths: foundBankCredit.durationInMonths,
          status: foundBankCredit.status,
          accountId: foundBankCredit.accountId,
          advisorId: foundBankCredit.advisorId,
          ownerId: foundBankCredit.ownerId,
        });

        if (maybeBankCredit instanceof Error) {
          throw maybeBankCredit;
        }

        bankCredits.push(maybeBankCredit);
      });

      return bankCredits;
    } catch (error) {
      return [];
    }
  }
}
