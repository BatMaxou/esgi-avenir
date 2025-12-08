import { InvalidDeleteAccountParamsError } from "../../errors/params/account/InvalidDeleteAccountParamsError";

interface Params {
  id?: string;
}

export class DeleteAccountParams {
  public static from(params: Params): DeleteAccountParams | InvalidDeleteAccountParamsError {
    if (!params.id) {
      return new InvalidDeleteAccountParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidDeleteAccountParamsError('Params not valid.');
    }

    return new DeleteAccountParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}


