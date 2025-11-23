import { BeneficiaryRepositoryInterface, UpdateBeneficiaryPayload } from "../../../../application/repositories/BeneficiaryRepositoryInterface";
import { Beneficiary } from "../../../../domain/entities/Beneficiary";
import { BeneficiaryNotFoundError } from "../../../../domain/errors/entities/beneficiary/BeneficiaryNotFoundError";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { databaseDsn } from "../../../express/utils/tools";
import { MariadbConnection } from "../config/MariadbConnection";
import { BeneficiaryModel } from "../models/BeneficiaryModel";
import { UserModel } from "../models/UserModel";
import { Op } from "sequelize";
import { AccountModel } from "../models/AccountModel";
import { AccountNotFoundError } from "../../../../domain/errors/entities/account/AccountNotFoundError";

export class MariadbBeneficiaryRepository implements BeneficiaryRepositoryInterface {
  private beneficiaryModel: BeneficiaryModel;

  public constructor() {
    const connection = new MariadbConnection(databaseDsn).getConnection();
    const userModel = new UserModel(connection);
    const accountModel = new AccountModel(connection, userModel);
    this.beneficiaryModel = new BeneficiaryModel(connection, userModel, accountModel);
  }

  public async create(beneficiary: Beneficiary): Promise<Beneficiary | UserNotFoundError | AccountNotFoundError> {
    try {
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
      if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
        if (error.message.includes('ownerId')) {
          return new UserNotFoundError('User not found.');
        } else if (error.message.includes('accountId')) {
          return new AccountNotFoundError('Account not found.');
        }
      }

      throw error;
    }
  }

  public async update(beneficiary: UpdateBeneficiaryPayload): Promise<Beneficiary | BeneficiaryNotFoundError> {
    try {
      const { id, ...toUpdate } = beneficiary;

      await this.beneficiaryModel.model.update({
        ...toUpdate,
      }, {
        where: { id },
      });

      return await this.findById(id);
    } catch (error) {
      throw new BeneficiaryNotFoundError('Beneficiary not found.');
    }
  }

  public async findAllByOwnerLike(ownerId: number, term: string): Promise<Beneficiary[]> {
    const foundBeneficiaries = await this.beneficiaryModel.model.findAll({
      where: {
        ownerId: ownerId,
        name: {
          [Op.like]: `%${term}%`
        }
      },
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
  }

  public async findById(id: number): Promise<Beneficiary | BeneficiaryNotFoundError> {
    try {
      const foundBeneficiary = await this.beneficiaryModel.model.findByPk(id);
      if (!foundBeneficiary) {
        return new BeneficiaryNotFoundError('Beneficiary not found.');
      }

      const maybeBeneficiary = Beneficiary.from(foundBeneficiary);
      if (maybeBeneficiary instanceof Error) {
        throw maybeBeneficiary;
      }

      return maybeBeneficiary;
    } catch (error) {
      throw new BeneficiaryNotFoundError('Beneficiary not found');
    }
  }

  public async delete(id: number): Promise<boolean | BeneficiaryNotFoundError> {
    try {
      const deletedCount = await this.beneficiaryModel.model.destroy({ where: { id } });
      if (deletedCount === 0) {
        return new BeneficiaryNotFoundError('Beneficiary not found.');
      }

      return true;
    } catch (error) {
      throw new BeneficiaryNotFoundError('Beneficiary not found.');
    }
  }
}
