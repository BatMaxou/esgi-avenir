import { InvalidUpdateStockParamsError } from "../../errors/params/stock/InvalidUpdateStockParamsError";
import { RessourceParamsInterface } from "../RessourceParamsInterface";

interface Params extends RessourceParamsInterface {}

export class UpdateStockParams {
  public static from(params: Params): UpdateStockParams | InvalidUpdateStockParamsError {
    if (!params.id) {
      return new InvalidUpdateStockParamsError('Params not valid.');
    }
    
    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidUpdateStockParamsError('Params not valid.');
    }

    return new UpdateStockParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

