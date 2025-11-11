import { InvalidUpdateAccountParamsError } from "../../errors/params/account/InvalidUpdateAccountParamsError";

interface Params {
  id?: string;
}

export class UpdateAccountParams {
  public static from(params: Params): UpdateAccountParams | InvalidUpdateAccountParamsError {
    if (!params.id) {
      return new InvalidUpdateAccountParamsError('Params not valid.');
    }

    return new UpdateAccountParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

