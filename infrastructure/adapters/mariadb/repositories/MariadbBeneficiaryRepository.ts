import {
  BeneficiaryRepositoryInterface,
  UpdateBeneficiaryPayload,
} from "../../../../application/repositories/BeneficiaryRepositoryInterface";
import { Beneficiary } from "../../../../domain/entities/Beneficiary";
import { BeneficiaryNotFoundError } from "../../../../domain/errors/entities/beneficiary/BeneficiaryNotFoundError";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { MariadbConnection } from "../config/MariadbConnection";
import { BeneficiaryModel } from "../models/BeneficiaryModel";
import { UserModel } from "../models/UserModel";
import { Op } from "sequelize";
import { AccountModel } from "../models/AccountModel";
import { AccountNotFoundError } from "../../../../domain/errors/entities/account/AccountNotFoundError";

export class MariadbBeneficiaryRepository implements BeneficiaryRepositoryInterface {
  private userModel: UserModel;
  private accountModel: AccountModel;
  private beneficiaryModel: BeneficiaryModel;

  public constructor(databaseDsn: string) {
    const connection = new MariadbConnection(databaseDsn).getConnection();
    this.userModel = new UserModel(connection);
    this.accountModel = new AccountModel(connection, this.userModel);
    this.beneficiaryModel = new BeneficiaryModel(
      connection,
      this.userModel,
      this.accountModel
    );
  }

  public async create(
    beneficiary: Beneficiary
  ): Promise<Beneficiary | UserNotFoundError | AccountNotFoundError> {
    try {
      const maybeAccount = await this.accountModel.model.findByPk(beneficiary.accountId);
      if (!maybeAccount || maybeAccount.isDeleted) {
        return new AccountNotFoundError("Account not found.");
      }

      const createdBeneficiary = await this.beneficiaryModel.model.create({
        name: beneficiary.name,
        ownerId: beneficiary.ownerId,
        accountId: beneficiary.accountId,
      });

      const maybeBeneficiary = Beneficiary.from(createdBeneficiary);
      if (maybeBeneficiary instanceof Error) {
        throw maybeBeneficiary;
      }

      return maybeBeneficiary;
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "SequelizeForeignKeyConstraintError"
      ) {
        if (error.message.includes("ownerId")) {
          return new UserNotFoundError("User not found.");
        } else if (error.message.includes("accountId")) {
          return new AccountNotFoundError("Account not found.");
        }
      }

      return new UserNotFoundError("User not found.");
    }
  }

  public async update(
    beneficiary: UpdateBeneficiaryPayload
  ): Promise<Beneficiary | BeneficiaryNotFoundError> {
    try {
      const { id, ...toUpdate } = beneficiary;

      await this.beneficiaryModel.model.update(
        {
          ...toUpdate,
        },
        {
          where: { id },
        }
      );

      return await this.findById(id);
    } catch (error) {
      return new BeneficiaryNotFoundError("Beneficiary not found.");
    }
  }

  public async findAllByOwnerLike(
    ownerId: number,
    term: string
  ): Promise<Beneficiary[]> {
    try {
      const foundBeneficiaries = await this.beneficiaryModel.model.findAll({
        where: {
          ownerId: ownerId,
          name: {
            [Op.like]: `%${term}%`,
          },
        },
        include: [
          {
            model: this.accountModel.model,
            as: 'account',
          },
          {
            model: this.userModel.model,
            as: 'owner',
          },
        ],
      });

      const beneficiaries: Beneficiary[] = [];

      foundBeneficiaries.forEach((foundBeneficiary) => {
        const maybeBeneficiary = Beneficiary.from(foundBeneficiary);

        if (maybeBeneficiary instanceof Error) {
          throw maybeBeneficiary;
        }

        beneficiaries.push(maybeBeneficiary);
      });

      return beneficiaries;
    } catch (error) {
      return [];
    }
  }

  public async findById(
    id: number
  ): Promise<Beneficiary | BeneficiaryNotFoundError> {
    try {
      const foundBeneficiary = await this.beneficiaryModel.model.findByPk(id);
      if (!foundBeneficiary) {
        return new BeneficiaryNotFoundError("Beneficiary not found.");
      }

      const maybeBeneficiary = Beneficiary.from(foundBeneficiary);
      if (maybeBeneficiary instanceof Error) {
        throw maybeBeneficiary;
      }

      return maybeBeneficiary;
    } catch (error) {
      return new BeneficiaryNotFoundError("Beneficiary not found.");
    }
  }

  public async delete(id: number): Promise<boolean | BeneficiaryNotFoundError> {
    try {
      const deletedCount = await this.beneficiaryModel.model.destroy({
        where: { id },
      });
      if (deletedCount === 0) {
        return new BeneficiaryNotFoundError("Beneficiary not found.");
      }

      return true;
    } catch (error) {
      return new BeneficiaryNotFoundError("Beneficiary not found.");
    }
  }

  public async deleteByAccount(id: number): Promise<boolean> {
    try {
      await this.beneficiaryModel.model.destroy({
        where: { accountId: id },
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  public async findByOwnerAndAccount(
    ownerId: number,
    accountId: number
  ): Promise<Beneficiary | BeneficiaryNotFoundError> {
    try {
      const foundBeneficiary = await this.beneficiaryModel.model.findOne({
        where: {
          ownerId,
          accountId,
        },
      });

      if (!foundBeneficiary) {
        return new BeneficiaryNotFoundError("Beneficiary not found.");
      }

      const maybeBeneficiary = Beneficiary.from(foundBeneficiary);
      if (maybeBeneficiary instanceof Error) {
        throw maybeBeneficiary;
      }

      return maybeBeneficiary;
    } catch (error) {
      return new BeneficiaryNotFoundError("Beneficiary not found.");
    }
  }
}
