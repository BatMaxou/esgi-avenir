import { OperationEnum } from '../enums/OperationEnum';
import { Account } from './Account';
import { InvalidOperationTypeError } from '../errors/entities/operation/InvalidOperationTypeError';
import { AccountNotFoundError } from '../errors/entities/account/AccountNotFoundError';
import { AccountNotEmptyError } from '../errors/entities/operation/AccountNotEmptyError';
import { Beneficiary } from './Beneficiary';

export interface HydratedOperation extends Operation {
  from: string | null;
  to: string | null;
  fromBeneficiary: Pick<Beneficiary, 'id' | 'name' | 'accountId'> | null;
  toBeneficiary: Pick<Beneficiary, 'id' | 'name' | 'accountId'> | null;
}

export class Operation {
  public id?: number;

  public static from({
    id,
    amount,
    type,
    name,
    createdAt,
    fromId,
    from,
    toId,
    to,
  }: {
    id?: number,
    amount: number,
    type: OperationEnum,
    name?: string,
    createdAt?: Date,
    fromId?: number,
    from?: Account,
    toId?: number,
    to?: Account,
  }): Operation | InvalidOperationTypeError | AccountNotFoundError | AccountNotEmptyError {
    const maybeFromId = fromId ?? from?.id;
    const maybeToId = toId ?? to?.id;

    switch (type) {
      case OperationEnum.DEPOSIT:
        if (!maybeToId) {
          return new AccountNotFoundError('Invalid destination account for deposit operation.');
        };

        if (maybeFromId !== undefined) {
          return new AccountNotEmptyError('Source should be empty for deposit operation.');
        };

        break;
      case OperationEnum.INTEREST:
        if (!maybeToId) {
          return new AccountNotFoundError('Invalid destination account for interest operation.');
        }

        if (maybeFromId !== undefined) {
          return new AccountNotEmptyError('Source should be empty for interest operation.');
        }

        break;
      case OperationEnum.WITHDRAWAL:
        if (!maybeFromId) {
          return new AccountNotFoundError('Invalid source account for withdrawal operation.');
        };

        if (maybeToId !== undefined) {
          return new AccountNotEmptyError('Destination should be empty for withdrawal operation.');
        };

        break;
      case OperationEnum.TRANSFER:
        if (!maybeFromId || !maybeToId) {
          return new AccountNotFoundError('Invalid source or destination account for transfer operation.');
        };

        break;
      case OperationEnum.FEE:
        if (!maybeFromId || maybeToId !== undefined) {
          return new AccountNotFoundError('Invalid source account for fee operation.');
        };

        break;
      case OperationEnum.TO_BANK:
        if (!maybeFromId) {
          return new AccountNotFoundError('Invalid source account for to bank operation.');
        };

        if (maybeToId !== undefined) {
          return new AccountNotEmptyError('Destination should be empty for to bank operation.');
        };

        break;
      case OperationEnum.FROM_BANK:
        if (!maybeToId) {
          return new AccountNotFoundError('Invalid destination account for from bank operation.');
        };

        if (maybeFromId !== undefined) {
          return new AccountNotEmptyError('Destination should be empty for to bank operation.');
        };

        break;
      default:
        return new InvalidOperationTypeError('Invalid operation type.');
    }

    const operation = new this(
      Math.round(amount * 100) / 100,
      type,
      name,
      createdAt,
      maybeFromId,
      maybeToId,
    );

    if (id) {
      operation.id = id;
    }

    return operation;
  }

  private constructor(
    public amount: number,
    public type: OperationEnum,
    public name?: string,
    public createdAt?: Date,
    public fromId?: number,
    public toId?: number,
  ) {
  }
}
