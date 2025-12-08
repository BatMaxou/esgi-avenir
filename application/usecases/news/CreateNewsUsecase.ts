import { News } from '../../../domain/entities/News';
import { NewsRepositoryInterface } from '../../repositories/NewsRepositoryInterface';
import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { InvalidHtmlContentError } from '../../../domain/errors/values/html-content/InvalidHtmlContentError';
import { SseServerClientInterface } from '../../services/sse/SseServerClientInterface';
import { SseRessourceEnum } from '../../services/sse/SseRessourceEnum';

export class CreateNewsUsecase<SseRequest, SseResponse> {
  public constructor(
    private readonly newsRepository: NewsRepositoryInterface,
    private readonly sseServerClient: SseServerClientInterface<SseRequest, SseResponse>,
  ) {}

  public async execute(
    title: string,
    content: string,
    author: User,
  ): Promise<News | UserNotFoundError | InvalidHtmlContentError> {
    const maybeNews = News.from({
      title,
      content,
      author,
    });
    if (
      maybeNews instanceof InvalidHtmlContentError
      || maybeNews instanceof UserNotFoundError
    ) {
      return maybeNews;
    }

    const maybeNewNews = await this.newsRepository.create(maybeNews);

    this.sseServerClient.broadcast(
      SseRessourceEnum.NEWS,
      maybeNewNews,
    );
    
    return maybeNewNews;
  }
}

