import { InvalidGetNewsListQueryError } from "../../errors/queries/news/InvalidGetNewsListQueryError";

interface SearchParams {
  term?: string | number | boolean;
  count?: string | number | boolean;
}

export class GetNewsListQuery {
  public static from(searchParams: SearchParams): GetNewsListQuery | InvalidGetNewsListQueryError {
    const term = searchParams.term
    if (term !== undefined && typeof term !== 'string') {
      return new InvalidGetNewsListQueryError('Query parameters are not valid')
    }

    const count = searchParams.count; 
    if (count !== undefined && typeof count !== 'string') {
      return new InvalidGetNewsListQueryError('Query parameters are not valid')
    }

    const parsedCount = count ? parseInt(count, 10) : undefined;

    return new GetNewsListQuery(
      term,
      parsedCount,
    )
  }

  private constructor(
    public term: string | undefined,
    public count: number | undefined,
  ) {
  }
}

