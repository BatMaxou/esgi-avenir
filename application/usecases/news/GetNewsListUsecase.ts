import { NewsRepositoryInterface } from '../../repositories/NewsRepositoryInterface';
import { News } from '../../../domain/entities/News';

export class GetNewsListUsecase {
  public constructor(
    private readonly newsRepository: NewsRepositoryInterface,
  ) {}

  public async execute(term: string): Promise<News[]> {
    return await this.newsRepository.findAllLike(term);
  }
}

