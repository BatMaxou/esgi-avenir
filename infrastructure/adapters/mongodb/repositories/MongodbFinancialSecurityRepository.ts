import { FinancialSecurityRepositoryInterface } from "../../../../application/repositories/FinancialSecurityRepositoryInterface";
import { FinancialSecurity } from "../../../../domain/entities/FinancialSecurity";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { StockNotFoundError } from "../../../../domain/errors/entities/stock/StockNotFoundError";
import { FinancialSecurityNotFoundError } from "../../../../domain/errors/entities/financial-security/FinancialSecurityNotFoundError";
import { FinancialSecurityModel } from "../models/FinancialSecurityModel";
import { UserModel } from "../models/UserModel";
import { StockModel } from "../models/StockModel";
import { getNextSequence } from "../models/CounterModel";
import { AbstractMongoRepository } from "./AbstractMongoRepository";

export class MongodbFinancialSecurityRepository extends AbstractMongoRepository implements FinancialSecurityRepositoryInterface {
  public async create(
    financialSecurity: FinancialSecurity
  ): Promise<FinancialSecurity | StockNotFoundError | UserNotFoundError> {
    try {
      await this.ensureConnection();

      const maybeUser = await UserModel.findOne({
        id: financialSecurity.ownerId,
      });
      if (!maybeUser) {
        return new UserNotFoundError("User not found.");
      }

      const maybeStock = await StockModel.findOne({
        id: financialSecurity.stockId,
      });
      if (!maybeStock) {
        return new StockNotFoundError("Stock not found.");
      }

      const nextId = await getNextSequence("financial_security_id");

      const createdFinancialSecurity = await FinancialSecurityModel.create({
        id: nextId,
        purchasePrice: financialSecurity.purchasePrice,
        ownerId: financialSecurity.ownerId,
        stockId: financialSecurity.stockId,
      });

      const foundFinancialSecurity = await this.findById(
        createdFinancialSecurity.id
      );
      if (foundFinancialSecurity instanceof FinancialSecurityNotFoundError) {
        throw foundFinancialSecurity;
      }

      const maybeFinancialSecurity = FinancialSecurity.from(
        foundFinancialSecurity
      );
      if (maybeFinancialSecurity instanceof Error) {
        throw maybeFinancialSecurity;
      }

      return maybeFinancialSecurity;
    } catch (error) {
      return new UserNotFoundError("User not found.");
    }
  }

  public async findById(
    id: number
  ): Promise<FinancialSecurity | FinancialSecurityNotFoundError> {
    try {
      await this.ensureConnection();

      const foundFinancialSecurity = await FinancialSecurityModel.findOne({
        id,
      });

      if (!foundFinancialSecurity) {
        return new FinancialSecurityNotFoundError(
          "Financial security not found."
        );
      }

      const maybeFinancialSecurity = FinancialSecurity.from({
        id: foundFinancialSecurity.id,
        purchasePrice: foundFinancialSecurity.purchasePrice,
        ownerId: foundFinancialSecurity.ownerId,
        stockId: foundFinancialSecurity.stockId,
      });

      if (maybeFinancialSecurity instanceof Error) {
        throw maybeFinancialSecurity;
      }

      return maybeFinancialSecurity;
    } catch (error) {
      return new FinancialSecurityNotFoundError(
        "Financial security not found."
      );
    }
  }

  public async findAllByOwner(ownerId: number): Promise<FinancialSecurity[]> {
    try {
      await this.ensureConnection();

      const foundFinancialSecurities = await FinancialSecurityModel.find({
        ownerId,
      });

      const financialSecurities: FinancialSecurity[] = [];

      foundFinancialSecurities.forEach((foundFinancialSecurity) => {
        const maybeFinancialSecurity = FinancialSecurity.from({
          id: foundFinancialSecurity.id,
          purchasePrice: foundFinancialSecurity.purchasePrice,
          ownerId: foundFinancialSecurity.ownerId,
          stockId: foundFinancialSecurity.stockId,
        });

        if (maybeFinancialSecurity instanceof Error) {
          throw maybeFinancialSecurity;
        }

        financialSecurities.push(maybeFinancialSecurity);
      });

      return financialSecurities;
    } catch (error) {
      return [];
    }
  }

  public async findAllByStock(stockId: number): Promise<FinancialSecurity[]> {
    try {
      await this.ensureConnection();

      const foundFinancialSecurities = await FinancialSecurityModel.find({
        stockId,
      });

      const financialSecurities: FinancialSecurity[] = [];

      foundFinancialSecurities.forEach((foundFinancialSecurity) => {
        const maybeFinancialSecurity = FinancialSecurity.from({
          id: foundFinancialSecurity.id,
          purchasePrice: foundFinancialSecurity.purchasePrice,
          ownerId: foundFinancialSecurity.ownerId,
          stockId: foundFinancialSecurity.stockId,
        });

        if (maybeFinancialSecurity instanceof Error) {
          throw maybeFinancialSecurity;
        }

        financialSecurities.push(maybeFinancialSecurity);
      });

      return financialSecurities;
    } catch (error) {
      return [];
    }
  }

  public async findOneByStockAndOwner(
    stockId: number,
    ownerId: number
  ): Promise<FinancialSecurity | FinancialSecurityNotFoundError> {
    try {
      await this.ensureConnection();

      const foundFinancialSecurity = await FinancialSecurityModel.findOne({
        stockId,
        ownerId,
      }).sort({ purchasePrice: 1 });

      if (!foundFinancialSecurity) {
        return new FinancialSecurityNotFoundError(
          "Financial security not found."
        );
      }

      const maybeFinancialSecurity = FinancialSecurity.from({
        id: foundFinancialSecurity.id,
        purchasePrice: foundFinancialSecurity.purchasePrice,
        ownerId: foundFinancialSecurity.ownerId,
        stockId: foundFinancialSecurity.stockId,
      });

      if (maybeFinancialSecurity instanceof Error) {
        throw maybeFinancialSecurity;
      }

      return maybeFinancialSecurity;
    } catch (error) {
      return new FinancialSecurityNotFoundError(
        "Financial security not found."
      );
    }
  }

  public async delete(
    id: number
  ): Promise<boolean | FinancialSecurityNotFoundError> {
    try {
      await this.ensureConnection();

      const deletedFinancialSecurity =
        await FinancialSecurityModel.findOneAndDelete({ id });

      if (!deletedFinancialSecurity) {
        return new FinancialSecurityNotFoundError(
          "Financial security not found."
        );
      }

      return true;
    } catch (error) {
      return new FinancialSecurityNotFoundError(
        "Financial security not found."
      );
    }
  }
}
