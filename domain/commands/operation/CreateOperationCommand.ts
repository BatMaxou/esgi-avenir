import { OperationEnum } from "../../enums/OperationEnum";
import { InvalidCreateOperationCommandError } from "../../errors/commands/operation/InvalidCreateOperationCommandError";

interface Body {
  type?: string;
  amount?: number | string;
  fromId?: number | string;
  toId?: number | string;
}

export class CreateOperationCommand {
  public static from(body: Body): CreateOperationCommand | InvalidCreateOperationCommandError {
    if (
      !body.type
      || !body.amount
      || typeof body.amount !== 'number'
      || !body.fromId
      || typeof body.fromId !== 'number'
      || !body.toId
      || typeof body.toId !== 'number'
    ) {
      return new InvalidCreateOperationCommandError('Payload is not valid.');
    }

    if (body.type !== OperationEnum.TRANSFER) {
      return new InvalidCreateOperationCommandError('Operation type is not valid.');
    }

    return new CreateOperationCommand(
      body.type,
      body.amount,
      body.fromId,
      body.toId,
    );
  }

  private constructor(
    public type: OperationEnum.TRANSFER,
    public amount: number,
    public fromId: number,
    public toId: number,
  ) {
  }
}

