import { InvalidGetLastNewsQueryError } from "../../errors/queries/news/InvalidGetLastNewsQueryError";

interface SearchParams {
  count?: string | number | boolean;
}

export class GetLastNewsQuery {
  public static from(searchParams: SearchParams): GetLastNewsQuery | InvalidGetLastNewsQueryError {
    const count = searchParams.count; 
    if (count !== undefined && typeof count !== 'string') {
      return new InvalidGetLastNewsQueryError('Query parameters are not valid')
    }

    const parsedCount = count ? parseInt(count, 10) : undefined;

    return new GetLastNewsQuery(
      parsedCount,
    )
  }

  private constructor(
    public count?: number,
  ) {
  }
}

