import { User } from "./User";
import { UserNotFoundError } from "../errors/entities/user/UserNotFoundError";
import { HtmlContentValue } from "../values/HtmlContentValue";
import { InvalidHtmlContentError } from "../errors/values/html-content/InvalidHtmlContentError";

export class News {
  public id?: number;

  public static from({
    id,
    title,
    content,
    createdAt,
    authorId,
    author,
  }: {
    id?: number,
    title: string,
    content: string,
    createdAt?: Date,
    authorId?: number,
    author?: User,
  }): News | UserNotFoundError | InvalidHtmlContentError {
    const maybeAuthorId = authorId ?? author?.id;
    if (!maybeAuthorId) {
      return new UserNotFoundError('News must have a valid authorId or author.');
    }

    const maybeContent = HtmlContentValue.from(content);
    if (maybeContent instanceof InvalidHtmlContentError) {
      return maybeContent;
    };

    const news = new this(
      title,
      maybeContent,
      maybeAuthorId,
      createdAt,
      author ?? undefined,
    );

    if (id) {
      news.id = id;
    }

    return news;
  }

  private constructor(
    public title: string,
    public content: HtmlContentValue,
    public authorId: number,
    public createdAt?: Date,
    public author?: User,
  ) {
  }
}
