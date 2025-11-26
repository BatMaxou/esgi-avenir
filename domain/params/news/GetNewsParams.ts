import { InvalidGetNewsParamsError } from "../../errors/params/news/InvalidGetNewsParamsError";

interface Params {
  id?: string;
}

export class GetNewsParams {
  public static from(params: Params): GetNewsParams | InvalidGetNewsParamsError {
    if (!params.id) {
      return new InvalidGetNewsParamsError('Params not valid.');
    }

    return new GetNewsParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

