import { InvalidGetNewsParamsError } from "../../errors/params/news/InvalidGetNewsParamsError";
import { RessourceParamsInterface } from "../RessourceParamsInterface";

interface Params extends RessourceParamsInterface {}

export class GetNewsParams {
  public static from(params: Params): GetNewsParams | InvalidGetNewsParamsError {
    if (!params.id) {
      return new InvalidGetNewsParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidGetNewsParamsError('Params not valid.');
    }

    return new GetNewsParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

