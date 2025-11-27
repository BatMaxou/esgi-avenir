import { News } from "../../domain/entities/News"
import { NewsNotFoundError } from "../../domain/errors/entities/news/NewsNotFoundError"
import { UserNotFoundError } from "../../domain/errors/entities/user/UserNotFoundError"
import { RepositoryInterface } from "./RepositoryInterface"
import { InvalidHtmlContentError } from "../../domain/errors/values/html-content/InvalidHtmlContentError"

export type UpdateNewsPayload = Omit<
  Partial<News>,
  'author' | 'authorId' | 'createdAt'
> & { id: number }

export interface NewsRepositoryInterface extends RepositoryInterface {
  create: (news: News) => Promise<News | UserNotFoundError | InvalidHtmlContentError>
  update: (news: UpdateNewsPayload) => Promise<News | NewsNotFoundError | InvalidHtmlContentError>
  delete: (id: number) => Promise<boolean | NewsNotFoundError>
  findById: (id: number) => Promise<News | NewsNotFoundError>
  findAllLike: (term: string, count: number) => Promise<News[]>
}
