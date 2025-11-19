import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { ApiClientInterface, DeleteResponseInterface } from "../../../../application/services/api/ApiClientInterface";
import { paths } from "../../../../application/services/api/paths";
import { AcceptStockOrderResponseInterface, CreateStockOrderPayloadInterface, GetStockOrderListResponseInterface, GetStockOrderResponseInterface, StockOrderResourceInterface } from "../../../../application/services/api/resources/StockOrderResourceInterface";

export class StockOrderResource implements StockOrderResourceInterface {
  constructor(private apiClient: ApiClientInterface) {}

  public async create(data: CreateStockOrderPayloadInterface): Promise<GetStockOrderResponseInterface | ApiClientError> {
    return this.apiClient.post<GetStockOrderResponseInterface>(paths.stockOrder.create, data);
  }

  public async getAll(): Promise<GetStockOrderListResponseInterface | ApiClientError> {
    return this.apiClient.get<GetStockOrderListResponseInterface>(paths.stockOrder.list);
  }

  public async accept(id: number, withId: number): Promise<AcceptStockOrderResponseInterface | ApiClientError> {
    return this.apiClient.post<AcceptStockOrderResponseInterface>(paths.stockOrder.accept(id), { withId });
  }

  public async delete(id: number): Promise<DeleteResponseInterface | ApiClientError> {
    return this.apiClient.delete(paths.stockOrder.delete(id));
  }

  public async match(id: number): Promise<GetStockOrderListResponseInterface | ApiClientError> {
    return this.apiClient.get<GetStockOrderListResponseInterface>(paths.stockOrder.match(id));
  }
}
