"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { useApiClient } from "./ApiContext";
import { getCookie } from "../../../utils/frontend/cookies";
import {
  GetBankCreditResponseInterface,
  GetHydratedBankCreditResponseInterface,
  CreateBankCreditPayloadInterface,
} from "../../../../application/services/api/resources/BankCreditResourceInterface";
import { GetMonthlyPaymentListResponseInterface } from "../../../../application/services/api/resources/MonthlyPaymentResourceInterface";
import { useAuth } from "./AuthContext";

type Props = {
  children: ReactNode;
};

type BankCreditsContextType = {
  bankCredit: GetBankCreditResponseInterface | null;
  bankCredits: GetHydratedBankCreditResponseInterface[];
  payments: GetMonthlyPaymentListResponseInterface;
  getAllForAdvisor: () => Promise<void>;
  isBankCreditLoading: boolean;
  isBankCreditsLoading: boolean;
  isPaymentsLoading: boolean;
};

export const BankCreditsContext = createContext<
  BankCreditsContextType | undefined
>(undefined);

export const BankCreditsProvider = ({ children }: Props) => {
  const { user } = useAuth();
  const [bankCredit, setBankCredit] =
    useState<GetBankCreditResponseInterface | null>(null);
  const [bankCredits, setBankCredits] = useState<
    GetHydratedBankCreditResponseInterface[]
  >([]);
  const [payments, setPayments] =
    useState<GetMonthlyPaymentListResponseInterface>([]);
  const [isBankCreditLoading, setIsBankCreditLoading] =
    useState<boolean>(false);
  const [isBankCreditsLoading, setIsBankCreditsLoading] =
    useState<boolean>(false);
  const [isPaymentsLoading, setIsPaymentsLoading] = useState<boolean>(false);
  const { apiClient } = useApiClient();

  const getAllForAdvisor = async () => {
    setIsBankCreditsLoading(true);

    if (!user) {
      setIsBankCreditsLoading(false);
      return;
    }
    const response = await apiClient.bankCredit.getAll();
    if (!(response instanceof ApiClientError)) {
      setBankCredits(response);
    }
    setIsBankCreditsLoading(false);
  };

  return (
    <BankCreditsContext.Provider
      value={{
        bankCredit,
        bankCredits,
        payments,
        getAllForAdvisor,
        isBankCreditLoading,
        isBankCreditsLoading,
        isPaymentsLoading,
      }}
    >
      {children}
    </BankCreditsContext.Provider>
  );
};

export const useBankCredits = () => {
  const context = useContext(BankCreditsContext);
  if (context === undefined) {
    throw new Error("useBankCredits must be used within a BankCreditsProvider");
  }
  return context;
};
