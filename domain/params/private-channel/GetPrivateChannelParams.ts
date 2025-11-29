import { InvalidGetPrivateChannelParamsError } from "../../errors/params/private-channel/InvalidGetPrivateChannelParamsError";

interface Params {
  id?: string;
}

export class GetPrivateChannelParams {
  public static from(params: Params): GetPrivateChannelParams | InvalidGetPrivateChannelParamsError {
    if (!params.id) {
      return new InvalidGetPrivateChannelParamsError('Params not valid.');
    }

    return new GetPrivateChannelParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

