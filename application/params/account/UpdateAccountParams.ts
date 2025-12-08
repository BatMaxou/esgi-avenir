import { InvalidUpdateAccountParamsError } from "../../errors/params/account/InvalidUpdateAccountParamsError";

interface Params {
  id?: string;
}

export class UpdateAccountParams {
  public static from(params: Params): UpdateAccountParams | InvalidUpdateAccountParamsError {
    if (!params.id) {
      return new InvalidUpdateAccountParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidUpdateAccountParamsError('Params not valid.');
    }

    return new UpdateAccountParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

