import { NewsRepositoryInterface } from '../repositories/NewsRepositoryInterface';
import { News } from '../../domain/entities/News';

type MockNews = {
  title: string,
  content: string,
  authorId: number,
}

export class NewsFixtures {
  public constructor(
    private readonly repository: NewsRepositoryInterface,
  ) {}

  public async load(): Promise<boolean | Error> {
    const newsList: MockNews[] = [
      {
        title: 'New Features Released',
        content: '<p>We are excited to announce the release of new features in our application. These features include...</p>',
        authorId: 5,
      },
      {
        title: 'Scheduled Maintenance',
        content: '<div style="color: red; background-color: #f0f0f0; padding: 10px;">Please be aware that we have scheduled maintenance on our servers this weekend. During this time, the application may be temporarily unavailable. We apologize for any inconvenience this may cause and appreciate your understanding.</div>',
        authorId: 3,
      },
    ];

    for (const news of newsList) {
      await this.createNews(news);
    }

    return true;
  }

  private async createNews(mockNews: MockNews): Promise<boolean | Error> {
    const maybeNews = News.from(mockNews);
    if (maybeNews instanceof Error) {
      return maybeNews;
    }

    const maybeError = await this.repository.create(maybeNews);
    if (maybeError instanceof Error) {
      return maybeError;
    }

    return true;
  }
}
