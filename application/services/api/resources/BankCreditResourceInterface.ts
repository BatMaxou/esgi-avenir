import { ApiClientError } from '../ApiClientError';
import type { BankCredit, HydratedBankCredit } from '../../../../domain/entities/BankCredit';
import { GetMonthlyPaymentListResponseInterface } from './MonthlyPaymentResourceInterface';

export interface GetBankCreditResponseInterface extends BankCredit {}
export interface GetHydratedBankCreditResponseInterface extends HydratedBankCredit {}
export interface GetBankCreditListResponseInterface extends Array<GetHydratedBankCreditResponseInterface> {}

export interface CreateBankCreditPayloadInterface {
  amount: number;
  insurancePercentage: number;
  interestPercentage: number;
  durationInMonths: number;
  ownerId: number;
  accountId: number;
}

export interface BankCreditResourceInterface {
  getAll(): Promise<GetBankCreditListResponseInterface | ApiClientError>;
  create(data: CreateBankCreditPayloadInterface): Promise<GetBankCreditResponseInterface | ApiClientError>;
  getPayments(id: number): Promise<GetMonthlyPaymentListResponseInterface | ApiClientError>;
}

