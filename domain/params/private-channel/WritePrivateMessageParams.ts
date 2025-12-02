import { InvalidWritePrivateMessageParamsError } from "../../errors/params/private-channel/InvalidWritePrivateMessageParamsError";

interface Params {
  id?: string;
}

export class WritePrivateMessageParams {
  public static from(params: Params): WritePrivateMessageParams | InvalidWritePrivateMessageParamsError {
    if (!params.id) {
      return new InvalidWritePrivateMessageParamsError('Params not valid.');
    }

    return new WritePrivateMessageParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

