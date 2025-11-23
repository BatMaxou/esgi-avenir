import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { ApiClientInterface, DeleteResponseInterface } from "../../../../application/services/api/ApiClientInterface";
import { paths } from "../../../../application/services/api/paths";
import { CreateBeneficiaryPayloadInterface, GetBeneficiaryListResponseInterface, GetBeneficiaryResponseInterface, UpdateBeneficiaryPayloadInterface, BeneficiaryResourceInterface } from "../../../../application/services/api/resources/BeneficiaryResourceInterface";

export class BeneficiaryResource implements BeneficiaryResourceInterface {
  constructor(private apiClient: ApiClientInterface) {}

  public async create(data: CreateBeneficiaryPayloadInterface): Promise<GetBeneficiaryResponseInterface | ApiClientError> {
    return this.apiClient.post<GetBeneficiaryResponseInterface>(paths.beneficiary.create, data);
  }

  public async getAll(term?: string): Promise<GetBeneficiaryListResponseInterface | ApiClientError> {
    return this.apiClient.get<GetBeneficiaryListResponseInterface>(paths.beneficiary.list(term ? { term } : undefined));
  }

  public async update(data: UpdateBeneficiaryPayloadInterface): Promise<GetBeneficiaryResponseInterface | ApiClientError> {
    return this.apiClient.put<GetBeneficiaryResponseInterface>(paths.beneficiary.update(data.id), data);
  }

  public async delete(id: number): Promise<DeleteResponseInterface | ApiClientError> {
    return this.apiClient.delete(paths.beneficiary.delete(id));
  }
}
