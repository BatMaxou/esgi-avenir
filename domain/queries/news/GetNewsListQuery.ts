import { InvalidGetNewsListQueryError } from "../../errors/queries/news/InvalidGetNewsListQueryError";

interface SearchParams {
  term?: string | number | boolean;
}

export class GetNewsListQuery {
  public static from(searchParams: SearchParams): GetNewsListQuery | InvalidGetNewsListQueryError {
    const term = searchParams.term
    if (term !== undefined && typeof term !== 'string') {
      return new InvalidGetNewsListQueryError('Query parameters are not valid')
    }

    return new GetNewsListQuery(
      term,
    )
  }

  private constructor(
    public term: string | undefined
  ) {
  }
}

