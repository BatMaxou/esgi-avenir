import { InvalidUnbanUserParamsError } from '../../errors/params/user/InvalidUnbanUserParamsError';

interface Params {
  id?: string;
}

export class UnbanUserParams {
  public static from(params: Params): UnbanUserParams | InvalidUnbanUserParamsError {
    if (!params.id) {
      return new InvalidUnbanUserParamsError('Params not valid.');
    }

    return new UnbanUserParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}


