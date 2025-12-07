import { InvalidDeleteNewsParamsError } from "../../errors/params/news/InvalidDeleteNewsParamsError";

interface Params {
  id?: string;
}

export class DeleteNewsParams {
  public static from(params: Params): DeleteNewsParams | InvalidDeleteNewsParamsError {
    if (!params.id) {
      return new InvalidDeleteNewsParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidDeleteNewsParamsError('Params not valid.');
    }

    return new DeleteNewsParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}


