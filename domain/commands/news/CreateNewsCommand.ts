import { CreateNewsPayloadInterface } from "../../../application/services/api/resources/NewsResourceInterface";
import { InvalidCreateNewsCommandError } from "../../errors/commands/news/InvalidCreateNewsCommandError";

interface Body extends CreateNewsPayloadInterface {}

export class CreateNewsCommand {
  public static from(body: Body): CreateNewsCommand | InvalidCreateNewsCommandError {
    if (
      !body.title
      || typeof body.title !== 'string'
      || !body.content
      || typeof body.content !== 'string'
    ) {
      return new InvalidCreateNewsCommandError('Payload is not valid.');
    }

    return new CreateNewsCommand(
      body.title,
      body.content,
    );
  }

  private constructor(
    public title: string,
    public content: string,
  ) {
  }
}

