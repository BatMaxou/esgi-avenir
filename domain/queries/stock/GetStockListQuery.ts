import { InvalidGetListStockQueryError } from "../../errors/queries/stock/InvalidGetListStockQueryError";

interface SearchParams {
  term?: string | number | boolean;
}

export class GetStockListQuery {
  public static from(searchParams: SearchParams): GetStockListQuery | InvalidGetListStockQueryError {
    const term = searchParams.term
    if (term !== undefined && typeof term !== 'string') {
      return new InvalidGetListStockQueryError('Query parameters are not valid')
    }

    return new GetStockListQuery(
      term,
    )
  }

  private constructor(
    public term: string | undefined
  ) {
  }
}

