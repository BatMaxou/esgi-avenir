import { InvalidBanUserParamsError } from "../../errors/params/user/InvalidBanUserParamsError";

interface Params {
  id?: string;
}

export class BanUserParams {
  public static from(params: Params): BanUserParams | InvalidBanUserParamsError {
    if (!params.id) {
      return new InvalidBanUserParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidBanUserParamsError('Params not valid.');
    }

    return new BanUserParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}


