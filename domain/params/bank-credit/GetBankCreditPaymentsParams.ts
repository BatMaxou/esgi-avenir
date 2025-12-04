import { InvalidGetBankCreditPaymentsParamsError } from '../../errors/params/bank-credit/InvalidGetBankCreditPaymentsParamsError';

interface Params {
  id?: string;
}

export class GetBankCreditPaymentsParams {
  public static from(params: Params): GetBankCreditPaymentsParams | InvalidGetBankCreditPaymentsParamsError {
    if (!params.id) {
      return new InvalidGetBankCreditPaymentsParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidGetBankCreditPaymentsParamsError('Params not valid.');
    }

    return new GetBankCreditPaymentsParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

