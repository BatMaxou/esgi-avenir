import { BankCredit } from "../../../../domain/entities/BankCredit";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { databaseDsn } from "../../../express/utils/tools";
import { MariadbConnection } from "../config/MariadbConnection";
import { BankCreditModel } from "../models/BankCreditModel";
import { UserModel } from "../models/UserModel";
import { BankCreditRepositoryInterface, UpdateBankCreditPayload } from "../../../../application/repositories/BankCreditRepositoryInterface";
import { AccountModel } from "../models/AccountModel";
import { AccountNotFoundError } from "../../../../domain/errors/entities/account/AccountNotFoundError";
import { InvalidInsurancePercentageError } from "../../../../domain/errors/entities/bank-credit/InvalidInsurancePercentageError";
import { InvalidInterestPercentageError } from "../../../../domain/errors/entities/bank-credit/InvalidInterestPercentageError";
import { InvalidAmountError } from "../../../../domain/errors/entities/bank-credit/InvalidAmountError";
import { InvalidDurationInMonthsError } from "../../../../domain/errors/entities/bank-credit/InvalidDurationInMonthsError";
import { BankCreditNotFoundError } from "../../../../domain/errors/entities/bank-credit/BankCreditNotFoundError";
import { BankCreditStatusEnum } from "../../../../domain/enums/BankCreditStatusEnum";

export class MariadbBankCreditRepository implements BankCreditRepositoryInterface {
  private bankCreditModel: BankCreditModel;
  private userModel: UserModel;
  private accountModel: AccountModel;

  public constructor() {
    const connection = new MariadbConnection(databaseDsn).getConnection();
    this.userModel = new UserModel(connection);
    this.accountModel = new AccountModel(connection, this.userModel);
    this.bankCreditModel = new BankCreditModel(connection, this.userModel, this.accountModel);
  }

  public async create(bankCredit: BankCredit): Promise<BankCredit | UserNotFoundError | AccountNotFoundError | InvalidInsurancePercentageError | InvalidInterestPercentageError | InvalidAmountError | InvalidDurationInMonthsError> {
    try {
      const createdBankCredit = await this.bankCreditModel.model.create({
        amount: bankCredit.amount,
        insurancePercentage: bankCredit.insurancePercentage,
        interestPercentage: bankCredit.interestPercentage,
        durationInMonths: bankCredit.durationInMonths,
        status: bankCredit.status,
        accountId: bankCredit.accountId,
        advisorId: bankCredit.advisorId,
        ownerId: bankCredit.ownerId,
      });

      const maybeBankCredit = BankCredit.from(createdBankCredit);
      if (maybeBankCredit instanceof Error) {
        throw maybeBankCredit;
      }

      return maybeBankCredit;
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
        if (error.message.includes('advisorId')) {
          return new UserNotFoundError('User not found.');
        } else if (error.message.includes('accountId')) {
          return new AccountNotFoundError('Account not found.');
        }
      }

      throw error;
    }
  }

  public async update(stockOrder: UpdateBankCreditPayload): Promise<BankCredit | BankCreditNotFoundError> {
    try {
      const { id, ...toUpdate } = stockOrder;

      await this.bankCreditModel.model.update({
        ...toUpdate,
      }, {
        where: { id },
      });

      return await this.findById(id);
    } catch (error) {
      throw new BankCreditNotFoundError('BankCredit not found.');
    }
  }

  public async findById(id: number): Promise<BankCredit | BankCreditNotFoundError> {
    try {
      const foundBankCredit = await this.bankCreditModel.model.findByPk(
        id,
        {
          include: [
            { model: this.userModel.model, as: 'advisor' },
            { model: this.accountModel.model },
            { model: this.userModel.model, as: 'owner' },
          ],
        }
      );
      if (!foundBankCredit) {
        return new BankCreditNotFoundError('BankCredit not found.');
      }

      const maybeBankCredit = BankCredit.from(foundBankCredit);
      if (maybeBankCredit instanceof Error) {
        throw maybeBankCredit;
      }

      return maybeBankCredit;
    } catch (error) {
      throw new BankCreditNotFoundError('BankCredit not found');
    }
  }

  public async findAllByAdvisor(advisorId: number): Promise<BankCredit[]> {
    const foundBankCredits = await this.bankCreditModel.model.findAll({
      where: {
        advisorId,
      },
    });

    const bankCredits: BankCredit[] = [];

    foundBankCredits.forEach((foundBankCredit) => {
      const maybeBankCredit = BankCredit.from(foundBankCredit);
      if (maybeBankCredit instanceof Error) {
        throw maybeBankCredit;
      }

      bankCredits.push(maybeBankCredit);
    });

    return bankCredits;
  }

  public async findAllByOwner(ownerId: number): Promise<BankCredit[]> {
    const foundBankCredits = await this.bankCreditModel.model.findAll({
      where: {
        ownerId,
      },
    });

    const bankCredits: BankCredit[] = [];

    foundBankCredits.forEach((foundBankCredit) => {
      const maybeBankCredit = BankCredit.from(foundBankCredit);
      if (maybeBankCredit instanceof Error) {
        throw maybeBankCredit;
      }

      bankCredits.push(maybeBankCredit);
    });

    return bankCredits;
  }

  public async findAllNotCompleted(): Promise<BankCredit[]> {
    const foundBankCredits = await this.bankCreditModel.model.findAll({
      where: {
        status: BankCreditStatusEnum.APPROVED,
      },
    });

    const bankCredits: BankCredit[] = [];

    foundBankCredits.forEach((foundBankCredit) => {
      const maybeBankCredit = BankCredit.from(foundBankCredit);
      if (maybeBankCredit instanceof Error) {
        throw maybeBankCredit;
      }

      bankCredits.push(maybeBankCredit);
    });

    return bankCredits;
  }
}
