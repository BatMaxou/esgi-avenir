import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { ApiClientInterface } from "../../../../application/services/api/ApiClientInterface";
import { paths } from "../../../../application/services/api/paths";
import { FinancialSecurityResourceInterface, GetFinancialSecurityListResponseInterface } from "../../../../application/services/api/resources/FinancialSecurityResourceInterface";

export class FinancialSecurityResource implements FinancialSecurityResourceInterface {
  constructor(private apiClient: ApiClientInterface) {}

  public async getAll(): Promise<GetFinancialSecurityListResponseInterface | ApiClientError> {
    return this.apiClient.get<GetFinancialSecurityListResponseInterface>(paths.financialSecurity.list);
  }
}
