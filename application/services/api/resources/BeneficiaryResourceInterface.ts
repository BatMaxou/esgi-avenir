import { ApiClientError } from '../ApiClientError';
import { DeleteResponseInterface } from '../ApiClientInterface';
import type { Beneficiary } from '../../../../domain/entities/Beneficiary';

export interface GetBeneficiaryResponseInterface extends Beneficiary {}
export interface GetBeneficiaryListResponseInterface extends Array<GetBeneficiaryResponseInterface> {}

export interface CreateBeneficiaryPayloadInterface {
  name: string;
  accountId: number;
}

export interface UpdateBeneficiaryPayloadInterface {
  id: number;
  name?: string;
}

export interface BeneficiaryResourceInterface {
  getAll(term?: string): Promise<GetBeneficiaryListResponseInterface | ApiClientError>;
  create(data: CreateBeneficiaryPayloadInterface): Promise<GetBeneficiaryResponseInterface | ApiClientError>;
  update(data: UpdateBeneficiaryPayloadInterface): Promise<GetBeneficiaryResponseInterface | ApiClientError>;
  delete(id: number): Promise<DeleteResponseInterface | ApiClientError>;
}

