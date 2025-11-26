import { News } from '../../../domain/entities/News';
import { NewsRepositoryInterface } from '../../repositories/NewsRepositoryInterface';

export class GetLastNewsListUsecase {
  public constructor(
    private readonly newsRepository: NewsRepositoryInterface,
  ) {}

  public async execute(
    count?: number,
  ): Promise<News[]> {
    return await this.newsRepository.findLast(count || 16);
  }
}

