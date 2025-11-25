import { MonthlyPayment } from "../../../../domain/entities/MonthlyPayment";

export interface GetMonthlyPaymentResponseInterface extends MonthlyPayment {}
export interface GetMonthlyPaymentListResponseInterface extends Array<GetMonthlyPaymentResponseInterface> {}

export interface MonthlypaymentResourceInterface {}

