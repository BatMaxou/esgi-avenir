import { InvalidUpdateNewsParamsError } from "../../errors/params/news/InvalidUpdateNewsParamsError";

interface Params {
  id?: string;
}

export class UpdateNewsParams {
  public static from(params: Params): UpdateNewsParams | InvalidUpdateNewsParamsError {
    if (!params.id) {
      return new InvalidUpdateNewsParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidUpdateNewsParamsError('Params not valid.');
    }

    return new UpdateNewsParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

