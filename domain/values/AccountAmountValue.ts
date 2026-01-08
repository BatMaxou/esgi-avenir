import { Operation } from "../entities/Operation";
import { OperationEnum } from "../enums/OperationEnum";

export class AccountAmountValue {
  public static from(accountId: number, operations: Operation[]): AccountAmountValue {
    const total = operations.reduce((acc, operation) => {
      switch (operation.type) {
        case OperationEnum.DEPOSIT:
          return this.add(acc, operation.amount);
        case OperationEnum.WITHDRAWAL:
          return this.remove(acc, operation.amount);
        case OperationEnum.INTEREST:
          return this.add(acc, operation.amount);
        case OperationEnum.TRANSFER:
          if (operation.fromId === operation.toId) {
            return acc;
          }
          if (operation.toId === accountId) {
            return this.add(acc, operation.amount);
          }
          if (operation.fromId === accountId) {
            return this.remove(acc, operation.amount);
          }

          return acc;
        case OperationEnum.FEE:
          return this.remove(acc, operation.amount);
        case OperationEnum.TO_BANK:
          return this.remove(acc, operation.amount);
        case OperationEnum.FROM_BANK:
          return this.add(acc, operation.amount);
        default:
          return acc;
      }
    }, 0);

    return new AccountAmountValue(total / 100);
  }

  private static add(current: number, amount: number): number {
    return current + amount * 100;
  }

  private static remove(current: number, amount: number): number {
    return current - amount * 100;
  }

  private constructor(public value: number) {}
}
