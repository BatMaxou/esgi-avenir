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
    const connection = new MariadbConnection(databaseDsn).getConnection();
    const userModel = new UserModel(connection);
    const accountModel = new AccountModel(connection, userModel);
    this.operationModel = new OperationModel(connection, accountModel);
  }

  public async create(operation: Operation): Promise<Operation | AccountNotFoundError> {
    try {
      const createdOperation = await this.operationModel.model.create({
        amount: operation.amount,
        type: operation.type,
        fromId: operation.fromId,
        toId: operation.toId,
        name: operation.name,
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

      return new AccountNotFoundError('Account not found.');
    }
  }

  public async findByAccount(accountId: number): Promise<Operation[]> {
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
    } catch (error) {
      return [];
    }
  }
}
