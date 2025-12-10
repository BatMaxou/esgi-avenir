import { FinancialSecurityRepositoryInterface } from "../../../../application/repositories/FinancialSecurityRepositoryInterface";
import { FinancialSecurity } from "../../../../domain/entities/FinancialSecurity";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { MariadbConnection } from "../config/MariadbConnection";
import { FinancialSecurityModel } from "../models/FinancialSecurityModel";
import { UserModel } from "../models/UserModel";
import { StockModel } from "../models/StockModel";
import { StockNotFoundError } from "../../../../domain/errors/entities/stock/StockNotFoundError";
import { FinancialSecurityNotFoundError } from "../../../../domain/errors/entities/financial-security/FinancialSecurityNotFoundError";

export class MariadbFinancialSecurityRepository implements FinancialSecurityRepositoryInterface {
  private stockModel: StockModel;
  private financialSecurityModel: FinancialSecurityModel;

  public constructor(databaseDsn: string) {
    const connection = new MariadbConnection(databaseDsn).getConnection();
    const userModel = new UserModel(connection);
    this.stockModel = new StockModel(connection);
    this.financialSecurityModel = new FinancialSecurityModel(connection, userModel, this.stockModel);
  }

  public async create(financialSecurity: FinancialSecurity): Promise<FinancialSecurity | StockNotFoundError | UserNotFoundError> {
    try {
      const createdFinancialSecurity = await this.financialSecurityModel.model.create({
        purchasePrice: financialSecurity.purchasePrice,
        ownerId: financialSecurity.ownerId,
        stockId: financialSecurity.stockId,
      });

      const foundFinancialSecurity = await this.findById(createdFinancialSecurity.id);
      if (foundFinancialSecurity instanceof FinancialSecurityNotFoundError) {
        throw foundFinancialSecurity;
      }

      const maybeFinancialSecurity = FinancialSecurity.from(foundFinancialSecurity);
      if (maybeFinancialSecurity instanceof Error) {
        throw maybeFinancialSecurity;
      }

      return maybeFinancialSecurity;
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
        if (error.message.includes('ownerId')) {
          return new UserNotFoundError('User not found.');
        } else if (error.message.includes('stockId')) {
          return new StockNotFoundError('Stock not found.');
        }
      }

      return new UserNotFoundError('User not found.');
    }
  }

  public async findById(id: number): Promise<FinancialSecurity | FinancialSecurityNotFoundError> {
    try {
      const foundFinancialSecurity = await this.financialSecurityModel.model.findByPk(
        id,
        {
          include: [
            { model: this.stockModel.model }
          ],
        }
      );
      if (!foundFinancialSecurity) {
        return new FinancialSecurityNotFoundError('Financial security not found.');
      }

      const maybeFinancialSecurity = FinancialSecurity.from(foundFinancialSecurity);
      if (maybeFinancialSecurity instanceof Error) {
        throw maybeFinancialSecurity;
      }

      return maybeFinancialSecurity;
    } catch (error) {
      return new FinancialSecurityNotFoundError('Financial security not found.');
    }
  }

  public async findAllByOwner(ownerId: number): Promise<FinancialSecurity[]> {
    try {
      const foundFinancialSecurities = await this.financialSecurityModel.model.findAll({
        include: [
          {model: this.stockModel.model }
        ],
        where: {
          ownerId: ownerId,
        },
      });

      const financialSecurities: FinancialSecurity[] = [];

      foundFinancialSecurities.forEach((foundFinancialSecurity) => {
        const maybeFinancialSecurity = FinancialSecurity.from(foundFinancialSecurity);
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
      const foundFinancialSecurities = await this.financialSecurityModel.model.findAll({
        where: {
          stockId,
        },
      });

      const financialSecurities: FinancialSecurity[] = [];

      foundFinancialSecurities.forEach((foundFinancialSecurity) => {
        const maybeFinancialSecurity = FinancialSecurity.from(foundFinancialSecurity);
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

  public async findOneByStockAndOwner(stockId: number, ownerId: number): Promise<FinancialSecurity | FinancialSecurityNotFoundError> {
    try {
      const foundFinancialSecurity = await this.financialSecurityModel.model.findOne({
        where: {
          stockId,
          ownerId,
        },
        order: [['purchasePrice', 'ASC']],
      });

      if (!foundFinancialSecurity) {
        return new FinancialSecurityNotFoundError('Financial security not found.');
      }

      const maybeFinancialSecurity = FinancialSecurity.from(foundFinancialSecurity);
      if (maybeFinancialSecurity instanceof Error) {
        throw maybeFinancialSecurity;
      }

      return maybeFinancialSecurity;
    } catch (error) {
      return new FinancialSecurityNotFoundError('Financial security not found.');
    }
  }

  public async delete(id: number): Promise<boolean | FinancialSecurityNotFoundError> {
    try {
      const deletedCount = await this.financialSecurityModel.model.destroy({ where: { id } });
      if (deletedCount === 0) {
        return new FinancialSecurityNotFoundError('Financial security not found.');
      }

      return true;
    } catch (error) {
      return new FinancialSecurityNotFoundError('Financial security not found.');
    }
  }
}
