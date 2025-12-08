import { CreateOperationPayloadInterface } from "../../../application/services/api/resources/OperationResourceInterface";
import { OperationEnum } from "../../../domain/enums/OperationEnum";
import { InvalidCreateOperationCommandError } from "../../errors/commands/operation/InvalidCreateOperationCommandError";

interface Body extends Partial<CreateOperationPayloadInterface> {}

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
      || (body.name && typeof body.name !== 'string')
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
      body.name,
    );
  }

  private constructor(
    public type: OperationEnum.TRANSFER,
    public amount: number,
    public fromId: number,
    public toId: number,
    public name?: string,
  ) {
  }
}

