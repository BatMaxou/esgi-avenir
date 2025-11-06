import { InvalidGetUserParamsError } from '../../errors/params/user/InvalidGetUserParamsError';

interface Params {
  id?: string;
}

export class GetUserParams {
  public static from(params: Params): GetUserParams | InvalidGetUserParamsError {
    if (!params.id) {
      return new InvalidGetUserParamsError('Params not valid.');
    }

    return new GetUserParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}


