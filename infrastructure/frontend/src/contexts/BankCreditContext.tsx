"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useTranslations } from "next-intl";
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
import { useAccounts } from "./AccountsContext";
import { showErrorToast } from "@/lib/toast";

type Props = {
  children: ReactNode;
};

type BankCreditsContextType = {
  bankCredit: GetBankCreditResponseInterface | null;
  setBankCredit: (bankCredit: GetBankCreditResponseInterface | null) => void;
  bankCredits: GetHydratedBankCreditResponseInterface[];
  payments: GetMonthlyPaymentListResponseInterface;
  getAllForAdvisor: () => Promise<void>;
  createBankCredit: (
    data: CreateBankCreditPayloadInterface
  ) => Promise<boolean>;
  getBankCreditPayments: (id: number) => Promise<void>;
  isBankCreditLoading: boolean;
  isBankCreditsLoading: boolean;
  isPaymentsLoading: boolean;
};

export const BankCreditsContext = createContext<
  BankCreditsContextType | undefined
>(undefined);

export const BankCreditsProvider = ({ children }: Props) => {
  const t = useTranslations("contexts.bankCredits");
  const { user } = useAuth();
  const { getAccount } = useAccounts();
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

  const createBankCredit = async (data: CreateBankCreditPayloadInterface) => {
    setIsBankCreditLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsBankCreditLoading(false);
      return false;
    }

    const response = await apiClient.bankCredit.create(data);
    if (!(response instanceof ApiClientError)) {
      setBankCredit(response);
      getAccount(data.accountId);
      setIsBankCreditLoading(false);
      return true;
    } else {
      setIsBankCreditLoading(false);
      showErrorToast(t("errorCreating"));
      return false;
    }
  };

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

  const getBankCreditPayments = async (id: number) => {
    setIsPaymentsLoading(true);

    if (!user) {
      setIsPaymentsLoading(false);
      return;
    }
    const response = await apiClient.bankCredit.getPayments(id);
    if (!(response instanceof ApiClientError)) {
      setPayments(response);
    }
    setIsPaymentsLoading(false);
  };

  return (
    <BankCreditsContext.Provider
      value={{
        bankCredit,
        setBankCredit,
        bankCredits,
        payments,
        getAllForAdvisor,
        createBankCredit,
        getBankCreditPayments,
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
