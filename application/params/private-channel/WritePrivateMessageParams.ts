import { InvalidWritePrivateMessageParamsError } from "../../errors/params/private-channel/InvalidWritePrivateMessageParamsError";
import { RessourceParamsInterface } from "../RessourceParamsInterface";

interface Params extends RessourceParamsInterface {}

export class WritePrivateMessageParams {
  public static from(params: Params): WritePrivateMessageParams | InvalidWritePrivateMessageParamsError {
    if (!params.id) {
      return new InvalidWritePrivateMessageParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidWritePrivateMessageParamsError('Params not valid.');
    }

    return new WritePrivateMessageParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

