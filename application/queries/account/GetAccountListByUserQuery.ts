import { InvalidGetAccountListByUserQueryError } from "../../errors/queries/account/InvalidGetAccountListByUserQueryError";

export interface GetAccountListByUserSearchParams {
  firstName?: string | number | boolean;
  lastName?: string | number | boolean;
}

export class GetAccountListByUserQuery {
  public static from(searchParams: GetAccountListByUserSearchParams): GetAccountListByUserQuery | InvalidGetAccountListByUserQueryError {
    const firstName = searchParams.firstName
    const lastName = searchParams.lastName
    if (
      (firstName !== undefined && typeof firstName !== 'string')
      || (lastName !== undefined && typeof lastName !== 'string')
    ) {
      return new InvalidGetAccountListByUserQueryError('Query parameters are not valid')
    }

    return new GetAccountListByUserQuery(
      firstName,
      lastName,
    )
  }

  private constructor(
    public firstName: string | undefined,
    public lastName: string | undefined,
  ) {
  }
}

