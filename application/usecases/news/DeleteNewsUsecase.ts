import { User } from '../../../domain/entities/User';
import { NewsNotFoundError } from '../../../domain/errors/entities/news/NewsNotFoundError';
import { NewsRepositoryInterface } from '../../repositories/NewsRepositoryInterface';

export class DeleteNewsUsecase {
  public constructor(
    private readonly newsRepository: NewsRepositoryInterface,
  ) {}

  public async execute(
    id: number,
    author: User,
  ): Promise<boolean | NewsNotFoundError> {
    const maybeNews = await this.newsRepository.findById(id);
    if (maybeNews instanceof NewsNotFoundError) {
      return maybeNews;
    }

    if (maybeNews.authorId !== author.id) {
      return new NewsNotFoundError('News not found.');
    }

    return await this.newsRepository.delete(id);
  }
}

