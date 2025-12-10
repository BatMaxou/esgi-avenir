import { InvalidUnbanUserParamsError } from '../../errors/params/user/InvalidUnbanUserParamsError';
import { RessourceParamsInterface } from '../RessourceParamsInterface';

interface Params extends RessourceParamsInterface {}

export class UnbanUserParams {
  public static from(params: Params): UnbanUserParams | InvalidUnbanUserParamsError {
    if (!params.id) {
      return new InvalidUnbanUserParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidUnbanUserParamsError('Params not valid.');
    }

    return new UnbanUserParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}


