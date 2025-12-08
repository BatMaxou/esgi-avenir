import { InvalidDeleteUserParamsError } from "../../errors/params/user/InvalidDeleteUserParamsError";

interface Params {
  id?: string;
}

export class DeleteUserParams {
  public static from(params: Params): DeleteUserParams | InvalidDeleteUserParamsError {
    if (!params.id) {
      return new InvalidDeleteUserParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidDeleteUserParamsError('Params not valid.');
    }

    return new DeleteUserParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}


