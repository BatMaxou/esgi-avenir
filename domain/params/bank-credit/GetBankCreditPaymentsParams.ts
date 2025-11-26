import { InvalidGetBankCreditPaymentsParamsError } from '../../errors/params/bank-credit/InvalidGetBankCreditPaymentsParamsError';

interface Params {
  id?: string;
}

export class GetBankCreditPaymentsParams {
  public static from(params: Params): GetBankCreditPaymentsParams | InvalidGetBankCreditPaymentsParamsError {
    if (!params.id) {
      return new InvalidGetBankCreditPaymentsParamsError('Params not valid.');
    }

    return new GetBankCreditPaymentsParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

