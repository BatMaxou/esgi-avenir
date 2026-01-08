import { InvalidGetUserParamsError } from '../../errors/params/user/InvalidGetUserParamsError';
import { RessourceParamsInterface } from '../RessourceParamsInterface';

interface Params extends RessourceParamsInterface {}

export class GetUserParams {
  public static from(params: Params): GetUserParams | InvalidGetUserParamsError {
    if (!params.id) {
      return new InvalidGetUserParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidGetUserParamsError('Params not valid.');
    }

    return new GetUserParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}


