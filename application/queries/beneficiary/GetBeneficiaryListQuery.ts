import { InvalidGetListBeneficiaryQueryError } from "../../errors/queries/beneficiary/InvalidGetListBeneficiaryQueryError";

interface SearchParams {
  term?: string | number | boolean;
}

export class GetBeneficiaryListQuery {
  public static from(searchParams: SearchParams): GetBeneficiaryListQuery | InvalidGetListBeneficiaryQueryError {
    const term = searchParams.term
    if (term !== undefined && typeof term !== 'string') {
      return new InvalidGetListBeneficiaryQueryError('Query parameters are not valid')
    }

    return new GetBeneficiaryListQuery(
      term,
    )
  }

  private constructor(
    public term: string | undefined
  ) {
  }
}

