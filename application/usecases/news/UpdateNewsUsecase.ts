import { User } from '../../../domain/entities/User';
import { NewsRepositoryInterface, UpdateNewsPayload } from '../../repositories/NewsRepositoryInterface';
import { News } from '../../../domain/entities/News';
import { NewsNotFoundError } from '../../../domain/errors/entities/news/NewsNotFoundError';

export class UpdateNewsUsecase {
  public constructor(
    private readonly newsRepository: NewsRepositoryInterface,
  ) {}

  public async execute(
    author: User,
    news: UpdateNewsPayload,
  ): Promise<News | NewsNotFoundError> {
    const { id } = news;

    const maybeNews = await this.newsRepository.findById(id);
    if (maybeNews instanceof NewsNotFoundError) {
      return maybeNews;
    }

    if (maybeNews.authorId !== author.id) {
      return new NewsNotFoundError('News not found.');
    }

    return await this.newsRepository.update(news);
  }
}

