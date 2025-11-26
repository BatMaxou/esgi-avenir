import { News } from '../../../domain/entities/News';
import { NewsNotFoundError } from '../../../domain/errors/entities/news/NewsNotFoundError';
import { NewsRepositoryInterface } from '../../repositories/NewsRepositoryInterface';

export class GetNewsUsecase {
  public constructor(
    private readonly newsRepository: NewsRepositoryInterface,
  ) {}

  public async execute(
    id: number,
  ): Promise<News | NewsNotFoundError> {
    const maybeNews = await this.newsRepository.findById(id);
    if (maybeNews instanceof NewsNotFoundError) {
      return maybeNews;
    }

    return maybeNews;
  }
}

