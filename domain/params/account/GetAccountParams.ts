import { InvalidGetAccountParamsError } from "../../errors/params/account/InvalidGetAccountParamsError";

interface Params {
  id?: string;
}

export class GetAccountParams {
  public static from(params: Params): GetAccountParams | InvalidGetAccountParamsError {
    if (!params.id) {
      return new InvalidGetAccountParamsError('Params not valid.');
    }

    return new GetAccountParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

