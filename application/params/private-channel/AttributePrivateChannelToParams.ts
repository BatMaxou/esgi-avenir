import { InvalidAttributePrivateChannelToParamsError } from "../../errors/params/private-channel/InvalidAttributePrivateChannelToParamsError";
import { RessourceParamsInterface } from "../RessourceParamsInterface";

interface Params extends RessourceParamsInterface {}

export class AttributePrivateChannelToParams {
  public static from(params: Params): AttributePrivateChannelToParams | InvalidAttributePrivateChannelToParamsError {
    if (!params.id) {
      return new InvalidAttributePrivateChannelToParamsError('Params not valid.');
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id) || id <= 0) {
      return new InvalidAttributePrivateChannelToParamsError('Params not valid.');
    }

    return new AttributePrivateChannelToParams(
      id,
    );
  }

  private constructor(
    public id: number,
  ) {
  }
}

