"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { useApiClient } from "./ApiContext";
import { getCookie } from "../../../utils/frontend/cookies";
import { SettingEnum } from "../../../../domain/enums/SettingEnum";
import {
  GetSettingListResponseInterface,
  GetSettingResponseInterface,
} from "../../../../application/services/api/resources/SettingResourceInterface";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

type Props = {
  children: ReactNode;
};

type SettingsContextType = {
  savingsRate: string | number | boolean | undefined;
  purchaseFee: string | number | boolean | undefined;
  saleFee: string | number | boolean | undefined;
  getSavingsRate: () => Promise<null | undefined>;
  getPurchaseFee: () => Promise<null | undefined>;
  getSaleFee: () => Promise<null | undefined>;
  getAllSettings: () => Promise<void>;
  update: (code: SettingEnum, value: number) => Promise<void>;
  isSettingsLoading: boolean;
};

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = ({ children }: Props) => {
  const [savingsRate, setSavingsRate] = useState<
    string | number | boolean | undefined
  >(undefined);
  const [purchaseFee, setPurchaseFee] = useState<
    string | number | boolean | undefined
  >(undefined);
  const [saleFee, setSaleFee] = useState<string | number | boolean | undefined>(
    undefined
  );
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

  const getPurchaseFee = async () => {
    setIsSettingsLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsSettingsLoading(false);
      return null;
    }

    const response: GetSettingResponseInterface | ApiClientError =
      await apiClient.setting.getByCode(SettingEnum.STOCK_ORDER_PURCHASE_FEE);

    if (response instanceof ApiClientError) {
      setIsSettingsLoading(false);
      return;
    }

    setPurchaseFee(response.value);
    setIsSettingsLoading(false);
  };

  const getSaleFee = async () => {
    setIsSettingsLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsSettingsLoading(false);
      return null;
    }

    const response: GetSettingResponseInterface | ApiClientError =
      await apiClient.setting.getByCode(SettingEnum.STOCK_ORDER_SALE_FEE);

    if (response instanceof ApiClientError) {
      setIsSettingsLoading(false);
      return;
    }

    setSaleFee(response.value);
    setIsSettingsLoading(false);
  };

  const getAllSettings = async () => {
    setIsSettingsLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsSettingsLoading(false);
      return;
    }

    const response: GetSettingListResponseInterface | ApiClientError =
      await apiClient.setting.getAll();

    if (response instanceof ApiClientError) {
      setIsSettingsLoading(false);
      return;
    }

    response.forEach((setting) => {
      if (setting.code === SettingEnum.SAVINGS_RATE) {
        setSavingsRate(setting.value);
      }
      if (setting.code === SettingEnum.STOCK_ORDER_PURCHASE_FEE) {
        setPurchaseFee(setting.value);
      }
      if (setting.code === SettingEnum.STOCK_ORDER_SALE_FEE) {
        setSaleFee(setting.value);
      }
    });
    setIsSettingsLoading(false);
  };

  const update = async (code: SettingEnum, value: number): Promise<void> => {
    setIsSettingsLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsSettingsLoading(false);
      return;
    }

    const response: GetSettingResponseInterface | ApiClientError =
      await apiClient.setting.upsert({ code, value });

    if (response instanceof ApiClientError) {
      showErrorToast("Erreur lors de la mise à jour du paramètre.");
      setIsSettingsLoading(false);
      return;
    }

    if (code === SettingEnum.SAVINGS_RATE) {
      setSavingsRate(response.value);
      showSuccessToast("Taux d'épargne mis à jour avec succès");
    }
    if (code === SettingEnum.STOCK_ORDER_PURCHASE_FEE) {
      setPurchaseFee(response.value);
      showSuccessToast("Frais d'achat mis à jour avec succès");
    }
    if (code === SettingEnum.STOCK_ORDER_SALE_FEE) {
      setSaleFee(response.value);
      showSuccessToast("Frais de vente mis à jour avec succès");
    }
    getAllSettings();
    setIsSettingsLoading(false);
  };

  return (
    <SettingsContext.Provider
      value={{
        savingsRate,
        purchaseFee,
        saleFee,
        getSavingsRate,
        getPurchaseFee,
        getSaleFee,
        getAllSettings,
        update,
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
