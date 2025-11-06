import { InvalidDeleteUserParamsError } from "../../errors/params/user/InvalidDeleteUserParamsError";

interface Params {
  id?: string;
}

export class DeleteUserParams {
  public static from(params: Params): DeleteUserParams | InvalidDeleteUserParamsError {
    if (!params.id) {
      return new InvalidDeleteUserParamsError('Params not valid.');
    }

    return new DeleteUserParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}


