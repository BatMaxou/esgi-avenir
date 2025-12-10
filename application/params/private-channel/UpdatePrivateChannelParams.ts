import { InvalidUpdatePrivateChannelParamsError } from "../../errors/params/private-channel/InvalidUpdatePrivateChannelParamsError";
import { RessourceParamsInterface } from "../RessourceParamsInterface";

interface Params extends RessourceParamsInterface {}

export class UpdatePrivateChannelParams {
  public static from(params: Params): UpdatePrivateChannelParams | InvalidUpdatePrivateChannelParamsError {
    if (!params.id) {
      return new InvalidUpdatePrivateChannelParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidUpdatePrivateChannelParamsError('Params not valid.');
    }

    return new UpdatePrivateChannelParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

