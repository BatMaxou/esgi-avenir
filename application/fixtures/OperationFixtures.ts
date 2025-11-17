import { OperationRepositoryInterface } from '../repositories/OperationRepositoryInterface';
import { Operation } from '../../domain/entities/Operation';
import { IbanValue } from '../../domain/values/IbanValue';
import { OperationEnum } from '../../domain/enums/OperationEnum';

type MockOperation = {
  amount: number,
  type: OperationEnum,
  fromId?: number,
  toId?: number,
}

export class OperationFixtures {
  public constructor(
    private readonly repository: OperationRepositoryInterface,
  ) {}

  public async load(): Promise<boolean | Error> {
    const operations: MockOperation[] = [
      {
        amount: 100,
        type: OperationEnum.DEPOSIT,
        toId: 1,
      },
      {
        amount: 50,
        type: OperationEnum.TRANSFER,
        fromId: 1,
        toId: 2,
      },
      {
        amount: 20,
        type: OperationEnum.WITHDRAWAL,
        fromId: 2,
      },
      {
        amount: 100,
        type: OperationEnum.DEPOSIT,
        toId: 3,
      },
    ];

    for (const operation of operations) {
      await this.createOperation(operation);
    }

    return true;
  }

  private async createOperation(mockOperation: MockOperation): Promise<boolean | Error> {
    const maybeOperation = Operation.from(mockOperation);
    if (maybeOperation instanceof Error) {
      return maybeOperation;
    }

    const maybeError = await this.repository.create(maybeOperation);
    if (maybeError instanceof Error) {
      return maybeError;
    }

    return true;
  }
}
