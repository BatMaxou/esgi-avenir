import { UpdateNewsPayload } from "../../../application/repositories/NewsRepositoryInterface";
import { InvalidUpdateNewsCommandError } from "../../errors/commands/news/InvalidUpdateNewsCommandError";

interface Body extends UpdateNewsPayload {}

export class UpdateNewsCommand {
  public static from(body: Body): UpdateNewsCommand | InvalidUpdateNewsCommandError {
    if (
      body.title && typeof body.title !== 'string'
      || body.content && typeof body.content !== 'string'
    ) {
      return new InvalidUpdateNewsCommandError('Payload is not valid.');
    }

    return new UpdateNewsCommand(
      body.title,
      body.content,
    );
  }

  private constructor(
    public title?: string,
    public content?: string,
  ) {
  }
}

