import { UpdateCompanyChannelPayloadInterface } from "../../../application/services/api/resources/CompanyChannelResourceInterface";
import { InvalidUpdateCompanyChannelCommandError } from "../../errors/commands/company-channel/InvalidUpdateCompanyChannelCommandError";

interface Body extends Partial<UpdateCompanyChannelPayloadInterface> {}

export class UpdateCompanyChannelCommand {
  public static from(body: Body): UpdateCompanyChannelCommand | InvalidUpdateCompanyChannelCommandError {
    if (
      !body.title
      || typeof body.title !== 'string'
    ) {
      return new InvalidUpdateCompanyChannelCommandError('Payload is not valid.');
    }

    return new UpdateCompanyChannelCommand(
      body.title,
    );
  }

  private constructor(
    public title: string,
  ) {
  }
}

