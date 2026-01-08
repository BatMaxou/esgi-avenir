import { InvalidUpdateNewsParamsError } from "../../errors/params/news/InvalidUpdateNewsParamsError";
import { RessourceParamsInterface } from "../RessourceParamsInterface";

interface Params extends RessourceParamsInterface {}

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

