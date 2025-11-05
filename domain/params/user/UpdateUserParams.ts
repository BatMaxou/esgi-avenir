import { InvalidUpdateUserParamsError } from '../../errors/params/user/InvalidUpdateUserParamsError';

interface Params {
  id?: string;
}

export class UpdateUserParams {
  public static from(params: Params): UpdateUserParams | InvalidUpdateUserParamsError {
    if (!params.id) {
      return new InvalidUpdateUserParamsError('Params not valid.');
    }

    return new UpdateUserParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}


