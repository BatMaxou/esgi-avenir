import {
  BeneficiaryRepositoryInterface,
  UpdateBeneficiaryPayload,
} from "../../../../application/repositories/BeneficiaryRepositoryInterface";
import { Beneficiary } from "../../../../domain/entities/Beneficiary";
import { BeneficiaryNotFoundError } from "../../../../domain/errors/entities/beneficiary/BeneficiaryNotFoundError";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { AccountNotFoundError } from "../../../../domain/errors/entities/account/AccountNotFoundError";
import { BeneficiaryModel } from "../models/BeneficiaryModel";
import { AccountModel } from "../models/AccountModel";
import { UserModel } from "../models/UserModel";
import { getNextSequence } from "../models/CounterModel";
import { AbstractMongoRepository } from "./AbstractMongoRepository";

export class MongodbBeneficiaryRepository extends AbstractMongoRepository implements BeneficiaryRepositoryInterface {
  public async create(
    beneficiary: Beneficiary
  ): Promise<Beneficiary | UserNotFoundError | AccountNotFoundError> {
    try {
      await this.ensureConnection();

      const maybeAccount = await AccountModel.findOne({
        id: beneficiary.accountId,
      });
      if (!maybeAccount || maybeAccount.isDeleted) {
        return new AccountNotFoundError("Account not found.");
      }

      const maybeUser = await UserModel.findOne({ id: beneficiary.ownerId });
      if (!maybeUser) {
        return new UserNotFoundError("User not found.");
      }

      const nextId = await getNextSequence("beneficiary_id");

      const createdBeneficiary = await BeneficiaryModel.create({
        id: nextId,
        name: beneficiary.name,
        ownerId: beneficiary.ownerId,
        accountId: beneficiary.accountId,
      });

      const maybeBeneficiary = Beneficiary.from({
        id: createdBeneficiary.id,
        name: createdBeneficiary.name,
        ownerId: createdBeneficiary.ownerId,
        accountId: createdBeneficiary.accountId,
      });

      if (maybeBeneficiary instanceof Error) {
        throw maybeBeneficiary;
      }

      return maybeBeneficiary;
    } catch (error) {
      return new UserNotFoundError("User not found.");
    }
  }

  public async update(
    beneficiary: UpdateBeneficiaryPayload
  ): Promise<Beneficiary | BeneficiaryNotFoundError> {
    try {
      await this.ensureConnection();

      const { id, ...toUpdate } = beneficiary;

      const updatedBeneficiary = await BeneficiaryModel.findOneAndUpdate(
        { id },
        toUpdate,
        { new: true }
      );

      if (!updatedBeneficiary) {
        return new BeneficiaryNotFoundError("Beneficiary not found.");
      }

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
      await this.ensureConnection();

      const foundBeneficiaries = await BeneficiaryModel.find({
        ownerId,
        name: { $regex: term, $options: "i" },
      });

      const beneficiaries: Beneficiary[] = [];

      foundBeneficiaries.forEach((foundBeneficiary) => {
        const maybeBeneficiary = Beneficiary.from({
          id: foundBeneficiary.id,
          name: foundBeneficiary.name,
          ownerId: foundBeneficiary.ownerId,
          accountId: foundBeneficiary.accountId,
        });

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
      await this.ensureConnection();

      const foundBeneficiary = await BeneficiaryModel.findOne({ id });

      if (!foundBeneficiary) {
        return new BeneficiaryNotFoundError("Beneficiary not found.");
      }

      const maybeBeneficiary = Beneficiary.from({
        id: foundBeneficiary.id,
        name: foundBeneficiary.name,
        ownerId: foundBeneficiary.ownerId,
        accountId: foundBeneficiary.accountId,
      });

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
      await this.ensureConnection();

      const deletedBeneficiary = await BeneficiaryModel.findOneAndDelete({
        id,
      });

      if (!deletedBeneficiary) {
        return new BeneficiaryNotFoundError("Beneficiary not found.");
      }

      return true;
    } catch (error) {
      return new BeneficiaryNotFoundError("Beneficiary not found.");
    }
  }

  public async deleteByAccount(id: number): Promise<boolean> {
    try {
      await this.ensureConnection();

      await BeneficiaryModel.deleteMany({ accountId: id });

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
      await this.ensureConnection();

      const foundBeneficiary = await BeneficiaryModel.findOne({
        ownerId,
        accountId,
      });

      if (!foundBeneficiary) {
        return new BeneficiaryNotFoundError("Beneficiary not found.");
      }

      const maybeBeneficiary = Beneficiary.from({
        id: foundBeneficiary.id,
        name: foundBeneficiary.name,
        ownerId: foundBeneficiary.ownerId,
        accountId: foundBeneficiary.accountId,
      });

      if (maybeBeneficiary instanceof Error) {
        throw maybeBeneficiary;
      }

      return maybeBeneficiary;
    } catch (error) {
      return new BeneficiaryNotFoundError("Beneficiary not found.");
    }
  }
}
