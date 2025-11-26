import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { ApiClientInterface, DeleteResponseInterface } from "../../../../application/services/api/ApiClientInterface";
import { paths } from "../../../../application/services/api/paths";
import { CreateNewsPayloadInterface, GetNewsListResponseInterface, GetNewsResponseInterface, UpdateNewsPayloadInterface, NewsResourceInterface } from "../../../../application/services/api/resources/NewsResourceInterface";

export class NewsResource implements NewsResourceInterface {
  constructor(private apiClient: ApiClientInterface) {}

  public async get(id: number): Promise<GetNewsResponseInterface | ApiClientError> {
    return this.apiClient.get<GetNewsResponseInterface>(paths.news.detail(id));
  }

  public async getAll(term?: string): Promise<GetNewsListResponseInterface | ApiClientError> {
    return this.apiClient.get<GetNewsListResponseInterface>(paths.stock.list(term ? { term } : undefined));
  }

  public async getLast(count?: number): Promise<GetNewsListResponseInterface | ApiClientError> {
    return this.apiClient.get<GetNewsListResponseInterface>(paths.stock.list(count ? { count } : undefined));
  }

  public async create(data: CreateNewsPayloadInterface): Promise<GetNewsResponseInterface | ApiClientError> {
    return this.apiClient.post<GetNewsResponseInterface>(paths.news.create, data);
  }

  public async update(data: UpdateNewsPayloadInterface): Promise<GetNewsResponseInterface | ApiClientError> {
    return this.apiClient.put<GetNewsResponseInterface>(paths.news.update(data.id), data);
  }

  public async delete(id: number): Promise<DeleteResponseInterface | ApiClientError> {
    return this.apiClient.delete(paths.news.delete(id));
  }
}
