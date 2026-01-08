import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { ApiClientInterface } from "../../../../application/services/api/ApiClientInterface";
import { paths } from "../../../../application/services/api/paths";
import { CreateStockPayloadInterface, UpdateStockPayloadInterface, StockResourceInterface, GetStockResponseInterface, GetStockListResponseInterface, PurchaseBaseStockPayloadInterface, PurchaseBaseStockResponseInterface } from "../../../../application/services/api/resources/StockResourceInterface";

export class StockResource implements StockResourceInterface {
  constructor(private apiClient: ApiClientInterface) {}

  public async getAll(term?: string): Promise<GetStockListResponseInterface | ApiClientError> {
    return this.apiClient.get<GetStockListResponseInterface>(paths.stock.list(term ? { term } : undefined));
  }

  public async create(data: CreateStockPayloadInterface): Promise<GetStockResponseInterface | ApiClientError> {
    return this.apiClient.post<GetStockResponseInterface>(paths.stock.create, data);
  }

  public async update(data: UpdateStockPayloadInterface): Promise<GetStockResponseInterface | ApiClientError> {
    return this.apiClient.put<GetStockResponseInterface>(paths.stock.update(data.id), data);
  }

  public async purchaseBaseStock(id: number, data: PurchaseBaseStockPayloadInterface): Promise<PurchaseBaseStockResponseInterface | ApiClientError> {
    return this.apiClient.post<PurchaseBaseStockResponseInterface>(paths.stock.purchaseBaseStock(id), data);
  }
}
