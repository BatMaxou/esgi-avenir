import { FinancialSecurityRepositoryInterface } from "../../../../application/repositories/FinancialSecurityRepositoryInterface";
import { FinancialSecurity } from "../../../../domain/entities/FinancialSecurity";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { databaseDsn } from "../../../express/utils/tools";
import { MariadbConnection } from "../config/MariadbConnection";
import { FinancialSecurityModel } from "../models/FinancialSecurityModel";
import { UserModel } from "../models/UserModel";
import { StockModel } from "../models/StockModel";
import { StockNotFoundError } from "../../../../domain/errors/entities/stock/StockNotFoundError";

export class MariadbFinancialSecurityRepository implements FinancialSecurityRepositoryInterface {
  private financialSecurityModel: FinancialSecurityModel;

  public constructor() {
    const connection = new MariadbConnection(databaseDsn).getConnection();
    const userModel = new UserModel(connection);
    const stockModel = new StockModel(connection);
    this.financialSecurityModel = new FinancialSecurityModel(connection, userModel, stockModel);
  }

  public async create(financialSecurity: FinancialSecurity): Promise<FinancialSecurity | StockNotFoundError | UserNotFoundError> {
    try {
      const createdFinancialSecurity = await this.financialSecurityModel.model.create({
        purchasePrice: financialSecurity.purchasePrice,
        ownerId: financialSecurity.ownerId,
        stockId: financialSecurity.stockId,
      });

      const maybeFinancialSecurity = FinancialSecurity.from(createdFinancialSecurity);
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

      throw error;
    }
  }
}
