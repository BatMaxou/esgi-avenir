import { News } from '../../../domain/entities/News';
import { NewsRepositoryInterface } from '../../repositories/NewsRepositoryInterface';
import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { InvalidHtmlContentError } from '../../../domain/errors/values/html-content/InvalidHtmlContentError';

export class CreateNewsUsecase {
  public constructor(
    private readonly newsRepository: NewsRepositoryInterface,
  ) {}

  public async execute(
    title: string,
    content: string,
    author: User,
  ): Promise<News | UserNotFoundError | InvalidHtmlContentError> {
    const maybeNewsList = News.from({
      title,
      content,
      author,
    });
    if (
      maybeNewsList instanceof InvalidHtmlContentError
      || maybeNewsList instanceof UserNotFoundError
    ) {
      return maybeNewsList;
    }

    return await this.newsRepository.create(maybeNewsList);
  }
}

