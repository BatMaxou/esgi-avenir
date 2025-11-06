import { InvalidBanUserParamsError } from "../../errors/params/user/InvalidBanUserParamsError";

interface Params {
  id?: string;
}

export class BanUserParams {
  public static from(params: Params): BanUserParams | InvalidBanUserParamsError {
    if (!params.id) {
      return new InvalidBanUserParamsError('Params not valid.');
    }

    return new BanUserParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}


