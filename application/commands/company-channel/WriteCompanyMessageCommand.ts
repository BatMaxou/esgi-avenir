import { WriteCompanyMessagePayloadInterface } from "../../../application/services/api/resources/CompanyChannelResourceInterface";
import { InvalidWriteCompanyMessageCommandError } from "../../errors/commands/company-channel/InvalidWriteCompanyMessageCommandError";

interface Body extends Partial<WriteCompanyMessagePayloadInterface> {}

export class WriteCompanyMessageCommand {
  public static from(body: Body): WriteCompanyMessageCommand | InvalidWriteCompanyMessageCommandError {
    if (
      !body.content
      || typeof body.content !== 'string'
    ) {
      return new InvalidWriteCompanyMessageCommandError('Payload is not valid.');
    }

    return new WriteCompanyMessageCommand(
      body.content,
    );
  }

  private constructor(
    public content: string,
  ) {
  }
}

