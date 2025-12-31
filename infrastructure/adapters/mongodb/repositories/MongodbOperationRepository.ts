import { Operation } from "../../../../domain/entities/Operation";
import { AccountNotFoundError } from "../../../../domain/errors/entities/account/AccountNotFoundError";
import { OperationRepositoryInterface } from "../../../../application/repositories/OperationRepositoryInterface";
import { OperationModel } from "../models/OperationModel";
import { AccountModel } from "../models/AccountModel";
import { getNextSequence } from "../models/CounterModel";
import { openConnection } from "../config/MongodbConnection";

export class MongodbOperationRepository
  implements OperationRepositoryInterface
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
    operation: Operation
  ): Promise<Operation | AccountNotFoundError> {
    try {
      await this.ensureConnection();

      if (operation.fromId) {
        const fromAccount = await AccountModel.findOne({
          id: operation.fromId,
        });
        if (!fromAccount) {
          return new AccountNotFoundError("Account not found.");
        }
      }

      if (operation.toId) {
        const toAccount = await AccountModel.findOne({ id: operation.toId });
        if (!toAccount) {
          return new AccountNotFoundError("Account not found.");
        }
      }

      const nextId = await getNextSequence("operation_id");

      const createdOperation = await OperationModel.create({
        id: nextId,
        amount: operation.amount,
        type: operation.type,
        fromId: operation.fromId,
        toId: operation.toId,
        name: operation.name,
        createdAt: operation.createdAt || new Date(),
      });

      const maybeOperation = Operation.from({
        id: createdOperation.id,
        amount: createdOperation.amount,
        type: createdOperation.type,
        fromId: createdOperation.fromId,
        toId: createdOperation.toId,
        name: createdOperation.name,
        createdAt: createdOperation.createdAt,
      });

      if (maybeOperation instanceof Error) {
        throw maybeOperation;
      }

      return maybeOperation;
    } catch (error) {
      return new AccountNotFoundError("Account not found.");
    }
  }

  public async findByAccount(accountId: number): Promise<Operation[]> {
    try {
      await this.ensureConnection();

      const foundOperations = await OperationModel.find({
        $or: [{ fromId: accountId }, { toId: accountId }],
      });

      const operations: Operation[] = [];

      foundOperations.forEach((foundOperation) => {
        const maybeOperation = Operation.from({
          id: foundOperation.id,
          amount: foundOperation.amount,
          type: foundOperation.type,
          fromId: foundOperation.fromId,
          toId: foundOperation.toId,
          name: foundOperation.name,
          createdAt: foundOperation.createdAt,
        });

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
