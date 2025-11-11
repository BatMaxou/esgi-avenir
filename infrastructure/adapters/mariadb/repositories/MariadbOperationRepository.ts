import { Operation } from "../../../../domain/entities/Operation";
import { databaseDsn } from "../../../express/utils/tools";
import { MariadbConnection } from "../config/MariadbConnection";
import { OperationModel } from "../models/OperationModel";
import { UserModel } from "../models/UserModel";
import { AccountModel } from "../models/AccountModel";
import { AccountNotFoundError } from "../../../../domain/errors/entities/account/AccountNotFoundError";
import { OperationRepositoryInterface } from "../../../../application/repositories/OperationRepositoryInterface";
import { Op } from "sequelize";

export class MariadbOperationRepository implements OperationRepositoryInterface {
  private operationModel: OperationModel;

  public constructor() {
    const userModel = new UserModel(new MariadbConnection(databaseDsn).getConnection());
    const accountModel = new AccountModel(new MariadbConnection(databaseDsn).getConnection(), userModel);
    this.operationModel = new OperationModel(new MariadbConnection(databaseDsn).getConnection(), accountModel);
  }

  public async create(operation: Operation): Promise<Operation | AccountNotFoundError> {
    try {
      const createdOperation = await this.operationModel.model.create({
        amount: operation.amount,
        type: operation.type,
        fromId: operation.fromId,
        toId: operation.toId,
      });

      const maybeOperation = Operation.from(createdOperation);
      if (maybeOperation instanceof Error) {
        throw maybeOperation;
      }

      return maybeOperation;
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
        return new AccountNotFoundError('Account not found.');
      }

      throw new AccountNotFoundError('Account not found.');
    }
  }

  public async findByAccount(accountId: number): Promise<Operation[] | AccountNotFoundError> {
    try {
      const foundOperations = await this.operationModel.model.findAll({
        where: {
          [Op.or]: [
            { fromId: accountId },
            { toId: accountId },
          ],
        },
      });
      const operations: Operation[] = [];

      foundOperations.forEach((foundOperation) => {
        const maybeOperation = Operation.from(foundOperation);
        if (maybeOperation instanceof Error) {
          throw maybeOperation;
        }

        operations.push(maybeOperation);
      });

      return operations;
    }
    catch (error) {
      return new AccountNotFoundError('Account not found.');
    }
  }
}
