"use client";

import { GetMonthlyPaymentListResponseInterface } from "../../../../../../../application/services/api/resources/MonthlyPaymentResourceInterface";
import { Skeleton } from "../../atoms/skeleton";
import BankCreditOperationItem from "../item/bank-credit-operation-item";

interface BankCreditPaymentsListProps {
  payments: GetMonthlyPaymentListResponseInterface;
  isLoading: boolean;
}

export default function BankCreditPaymentsList({
  payments,
  isLoading,
}: BankCreditPaymentsListProps) {
  return (
    <div>
      {payments.length === 0 ? (
        <p>Aucun prélèvement n'a été effectué.</p>
      ) : (
        <ul className="space-y-2 overflow-scroll min-h-64 max-h-96 pr-3">
          {!isLoading ? (
            <>
              {payments.map((payment, uniqId) => (
                <BankCreditOperationItem payment={payment} key={uniqId} />
              ))}
            </>
          ) : (
            Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className="animate-pulse">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                  <Skeleton className="bg-gray-200 rounded-full w-10 h-10" />
                  <div className="flex-1 ms-4 space-y-2">
                    <Skeleton className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                  <Skeleton className="h-6 bg-gray-200 rounded w-20" />
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
