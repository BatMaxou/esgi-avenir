"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useTranslations } from "next-intl";
import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { useApiClient } from "./ApiContext";
import { getCookie } from "../../../utils/frontend/cookies";
import { CreateOperationPayloadInterface } from "../../../../application/services/api/resources/OperationResourceInterface";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

type Props = {
  children: ReactNode;
};

type OperationsContextType = {
  isLoading: boolean;
  create: (data: CreateOperationPayloadInterface) => Promise<boolean>;
};

export const OperationsContext = createContext<
  OperationsContextType | undefined
>(undefined);

export const OperationsProvider = ({ children }: Props) => {
  const t = useTranslations("contexts.operations");
  const { apiClient } = useApiClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const create = async (
    data: CreateOperationPayloadInterface
  ): Promise<boolean> => {
    setIsLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsLoading(false);
      showErrorToast(t("mustBeConnectedToTransfer"));
      return false;
    }

    const response = await apiClient.operation.create(data);

    if (response instanceof ApiClientError) {
      const errorResponse =
        String(response.message) === "Insufficient funds."
          ? t("insufficientFunds")
          : String(response.message) === "Account not found."
          ? t("accountNotFound")
          : t("transferError");
      showErrorToast(errorResponse);
      setIsLoading(false);
      return false;
    } else {
      showSuccessToast(t("transferSuccess"));
      setIsLoading(false);
      return true;
    }
  };

  return (
    <OperationsContext.Provider
      value={{
        isLoading,
        create,
      }}
    >
      {children}
    </OperationsContext.Provider>
  );
};

export const useOperations = () => {
  const context = useContext(OperationsContext);
  if (context === undefined) {
    throw new Error("useOperations must be used within an OperationsProvider");
  }
  return context;
};
