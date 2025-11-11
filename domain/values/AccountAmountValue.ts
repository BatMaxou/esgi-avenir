import { Operation } from "../entities/Operation";
import { OperationEnum } from "../enums/OperationEnum";

export class AccountAmountValue {
  public static from(accountId: number, operations: Operation[]): AccountAmountValue {
    const total = operations.reduce((acc, operation) => {
      switch (operation.type) {
        case OperationEnum.DEPOSIT:
          return acc + operation.amount;
        case OperationEnum.WITHDRAWAL:
          return acc - operation.amount;
        case OperationEnum.TRANSFER:
          if (operation.toId === accountId) {
            return acc + operation.amount;
          }
          if (operation.fromId === accountId) {
            return acc - operation.amount;
          }

          return acc;
        default:
          return acc;
      }
    }, 0);

    return new AccountAmountValue(total);
  }

  private constructor(public value: number) {}
}
