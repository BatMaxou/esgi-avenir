import { InvalidAttributePrivateChannelToParamsError } from "../../errors/params/private-channel/InvalidAttributePrivateChannelToParamsError";

interface Params {
  id?: string;
}

export class AttributePrivateChannelToParams {
  public static from(params: Params): AttributePrivateChannelToParams | InvalidAttributePrivateChannelToParamsError {
    if (!params.id) {
      return new InvalidAttributePrivateChannelToParamsError('Params not valid.');
    }

    return new AttributePrivateChannelToParams(
      parseInt(params.id, 10),
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

