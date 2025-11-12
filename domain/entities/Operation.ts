import { OperationEnum } from '../enums/OperationEnum';
import { InvalidAccountError } from '../errors/entities/operation/InvalidAccountError';
import { Account } from './Account';
import { InvalidOperationTypeError } from '../errors/entities/operation/InvalidOperationTypeError';

export interface HydratedOperation extends Operation {
  from: string | null;
  to: string | null;
}

export class Operation {
  public id?: number;

  public static from({
    id,
    amount,
    type,
    fromId,
    from,
    toId,
    to,
  }: {
    id?: number,
    amount: number,
    type: OperationEnum,
    fromId?: number,
    from?: Account,
    toId?: number,
    to?: Account,
  }): Operation | InvalidAccountError {
    const maybeFromId = fromId ?? from?.id;
    const maybeToId = toId ?? to?.id;

    switch (type) {
      case OperationEnum.DEPOSIT:
        if (!maybeToId) {
          return new InvalidAccountError('Invalid destination account for deposit operation.');
        };
        
        if (maybeFromId !== undefined) {
          return new InvalidAccountError('Source should be empty for deposit operation.');
        };

        break;
      case OperationEnum.WITHDRAWAL:
        if (!maybeFromId || maybeToId !== undefined) {
          return new InvalidAccountError('Invalid source account for withdrawal operation.');
        };
        
        if (maybeToId !== undefined) {
          return new InvalidAccountError('Destination should be empty for withdrawal operation.');
        };

        break;
      case OperationEnum.TRANSFER:
        if (!maybeFromId || !maybeToId) {
          return new InvalidAccountError('Invalid source or destination account for transfer operation.');
        };

        break;
      default:
        return new InvalidOperationTypeError('Invalid operation type.');
    }

    const operation = new this(
      amount,
      type,
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
    public fromId?: number,
    public toId?: number,
  ) {
  }
}
