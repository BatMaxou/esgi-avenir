import { ApiClientError } from '../ApiClientError';
import type { FinancialSecurity } from '../../../../domain/entities/FinancialSecurity';

export interface GetFinancialSecurityResponseInterface extends FinancialSecurity {}
export interface GetFinancialSecurityListResponseInterface extends Array<GetFinancialSecurityResponseInterface> {}

export interface FinancialSecurityResourceInterface {
  getAll(): Promise<GetFinancialSecurityListResponseInterface | ApiClientError>;
}

