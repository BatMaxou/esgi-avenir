import { CreateCompanyChannelPayloadInterface } from "../../../application/services/api/resources/CompanyChannelResourceInterface";
import { InvalidCreateCompanyChannelCommandError } from "../../errors/commands/company-channel/InvalidCreateCompanyChannelCommandError";

interface Body extends CreateCompanyChannelPayloadInterface {}

export class CreateCompanyChannelCommand {
  public static from(body: Body): CreateCompanyChannelCommand | InvalidCreateCompanyChannelCommandError {
    if (
      !body.title
      || typeof body.title !== 'string'
    ) {
      return new InvalidCreateCompanyChannelCommandError('Payload is not valid.');
    }

    return new CreateCompanyChannelCommand(
      body.title,
    );
  }

  private constructor(
    public title: string,
  ) {
  }
}

