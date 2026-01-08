import { InvalidUpdateUserParamsError } from '../../errors/params/user/InvalidUpdateUserParamsError';
import { RessourceParamsInterface } from '../RessourceParamsInterface';

interface Params extends RessourceParamsInterface {}

export class UpdateUserParams {
  public static from(params: Params): UpdateUserParams | InvalidUpdateUserParamsError {
    if (!params.id) {
      return new InvalidUpdateUserParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidUpdateUserParamsError('Params not valid.');
    }

    return new UpdateUserParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}


