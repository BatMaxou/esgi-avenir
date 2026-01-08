"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useTranslations } from "next-intl";
import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { useApiClient } from "./ApiContext";
import { getCookie } from "../../../utils/frontend/cookies";
import { FinancialSecurity } from "../../../../domain/entities/FinancialSecurity";
import { showErrorToast } from "@/lib/toast";

type Props = {
  children: ReactNode;
};

type FinancialSecuritiesContextType = {
  financialSecurity: FinancialSecurity | null;
  financialSecurities: FinancialSecurity[];
  isFinancialSecurityLoading: boolean;
  isFinancialSecuritiesLoading: boolean;
  getFinancialSecurities: () => Promise<void>;
};

export const FinancialSecuritiesContext = createContext<
  FinancialSecuritiesContextType | undefined
>(undefined);

export const FinancialSecuritiesProvider = ({ children }: Props) => {
  const t = useTranslations("contexts.financialSecurities");
  const [financialSecurity, setFinancialSecurity] =
    useState<FinancialSecurity | null>(null);
  const [financialSecurities, setFinancialSecurities] = useState<
    FinancialSecurity[]
  >([]);
  const [isFinancialSecuritiesLoading, setIsFinancialSecuritiesLoading] =
    useState<boolean>(false);
  const [isFinancialSecurityLoading, setIsFinancialSecurityLoading] =
    useState<boolean>(false);
  const { apiClient } = useApiClient();

  const getFinancialSecurities = async () => {
    setIsFinancialSecuritiesLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsFinancialSecuritiesLoading(false);
      showErrorToast(t("mustBeConnectedToView"));
      return;
    }

    const response = await apiClient.financialSecurity.getAll();

    if (response instanceof ApiClientError) {
      console.error("Failed to fetch financial securities:", response.message);
      showErrorToast(t("errorFetching"));
      setFinancialSecurities([]);
    } else {
      setFinancialSecurities(response);
    }

    setIsFinancialSecuritiesLoading(false);
  };

  return (
    <FinancialSecuritiesContext.Provider
      value={{
        financialSecurity,
        financialSecurities,
        isFinancialSecurityLoading,
        isFinancialSecuritiesLoading,
        getFinancialSecurities,
      }}
    >
      {children}
    </FinancialSecuritiesContext.Provider>
  );
};

export const useFinancialSecurities = () => {
  const context = useContext(FinancialSecuritiesContext);
  if (!context) {
    throw new Error(
      "useFinancialSecurities must be used within a FinancialSecuritiesProvider"
    );
  }

  return context;
};
