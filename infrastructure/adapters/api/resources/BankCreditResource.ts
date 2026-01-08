import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { paths } from "../../../../application/services/api/paths";
import { ApiClientInterface } from "../../../../application/services/api/ApiClientInterface";
import { BankCreditResourceInterface, CreateBankCreditPayloadInterface, GetBankCreditListResponseInterface, GetBankCreditResponseInterface } from "../../../../application/services/api/resources/BankCreditResourceInterface";
import { GetMonthlyPaymentListResponseInterface } from "../../../../application/services/api/resources/MonthlyPaymentResourceInterface";

export class BankCreditResource implements BankCreditResourceInterface{
  constructor(private apiClient: ApiClientInterface) {}

  public async getAll(): Promise<GetBankCreditListResponseInterface | ApiClientError> {
    return this.apiClient.get<GetBankCreditListResponseInterface>(paths.bankCredit.list);
  }

  public async create(data: CreateBankCreditPayloadInterface): Promise<GetBankCreditResponseInterface | ApiClientError> {
    return this.apiClient.post<GetBankCreditResponseInterface>(paths.bankCredit.create, data);
  }

  public async getPayments(id: number): Promise<GetMonthlyPaymentListResponseInterface | ApiClientError> {
    return this.apiClient.get<GetMonthlyPaymentListResponseInterface>(paths.bankCredit.payments(id));
  }
}
