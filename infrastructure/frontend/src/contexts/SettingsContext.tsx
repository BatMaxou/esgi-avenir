"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { useApiClient } from "./ApiContext";
import { getCookie } from "../../../utils/frontend/cookies";
import { SettingEnum } from "../../../../domain/enums/SettingEnum";
import { GetSettingResponseInterface } from "../../../../application/services/api/resources/SettingResourceInterface";

type Props = {
  children: ReactNode;
};

type SettingsContextType = {
  savingsRate: string | number | boolean | undefined;
  getSavingsRate: () => Promise<null | undefined>;
  isSettingsLoading: boolean;
};

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = ({ children }: Props) => {
  const [savingsRate, setSavingsRate] = useState<
    string | number | boolean | undefined
  >(undefined);
  const [isSettingsLoading, setIsSettingsLoading] = useState<boolean>(true);
  const { apiClient } = useApiClient();

  const getSavingsRate = async () => {
    setIsSettingsLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsSettingsLoading(false);
      return null;
    }

    const response: GetSettingResponseInterface | ApiClientError =
      await apiClient.setting.getByCode(SettingEnum.SAVINGS_RATE);

    if (response instanceof ApiClientError) {
      setIsSettingsLoading(false);
      return;
    }

    setSavingsRate(response.value);
    setIsSettingsLoading(false);
  };

  return (
    <SettingsContext.Provider
      value={{
        savingsRate,
        getSavingsRate,
        isSettingsLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }

  return context;
};
