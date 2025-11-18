import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { ApiClientInterface } from "../../../../application/services/api/ApiClientInterface";
import { paths } from "../../../../application/services/api/paths";
import { CreateStockPayloadInterface, UpdateStockPayloadInterface, StockResourceInterface, GetStockResponseInterface } from "../../../../application/services/api/resources/StockResourceInterface";

export class StockResource implements StockResourceInterface {
  constructor(private apiClient: ApiClientInterface) {}

  public async create(data: CreateStockPayloadInterface): Promise<GetStockResponseInterface | ApiClientError> {
    return this.apiClient.post<GetStockResponseInterface>(`${paths.stock.create}`, data);
  }

  public async update(data: UpdateStockPayloadInterface): Promise<GetStockResponseInterface | ApiClientError> {
    return this.apiClient.put<GetStockResponseInterface>(`${paths.stock.update(data.id)}`, data);
  }
}
