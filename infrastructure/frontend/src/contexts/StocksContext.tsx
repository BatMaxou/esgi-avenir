"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useTranslations } from "next-intl";
import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { useApiClient } from "./ApiContext";
import { getCookie } from "../../../utils/frontend/cookies";
import { Stock, HydratedStock } from "../../../../domain/entities/Stock";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

type Props = {
  children: ReactNode;
};

type StocksContextType = {
  stock: Stock | null;
  stocks: HydratedStock[];
  isStockLoading: boolean;
  isStocksLoading: boolean;
  getStocks: (term?: string) => Promise<void>;
  getAvailableCompanies: () => string[];
  createStock: (
    name: string,
    baseQuantity: number,
    basePrice: number
  ) => Promise<Stock | null>;
  updateStock: (
    id: number,
    name?: string,
    baseQuantity?: number
  ) => Promise<Stock | null>;
  refillStock: (
    id: number,
    additionalQuantity: number
  ) => Promise<Stock | null>;
  purchaseBaseStock: (id: number, accountId: number) => Promise<boolean>;
  setStock: (stock: Stock | null) => void;
};

export const StocksContext = createContext<StocksContextType | undefined>(
  undefined
);

export const StocksProvider = ({ children }: Props) => {
  const t = useTranslations("contexts.stocks");
  const [stock, setStock] = useState<Stock | null>(null);
  const [stocks, setStocks] = useState<HydratedStock[]>([]);
  const [isStocksLoading, setIsStocksLoading] = useState<boolean>(false);
  const [isStockLoading, setIsStockLoading] = useState<boolean>(false);
  const { apiClient } = useApiClient();

  const getStocks = async (term?: string) => {
    setIsStocksLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsStocksLoading(false);
      showErrorToast(t("mustBeConnectedToView"));
      return;
    }

    const response = await apiClient.stock.getAll(term);

    if (response instanceof ApiClientError) {
      console.error("Failed to fetch stocks:", response.message);
      showErrorToast(t("errorFetching"));
      setStocks([]);
    } else {
      setStocks(response);
    }

    setIsStocksLoading(false);
  };

  const getAvailableCompanies = (): string[] => {
    const availableStocks = stocks.filter(
      (stock) => stock.remainingQuantity > 0
    );
    const companyNames = availableStocks.map((stock) => stock.name);
    const uniqueCompanies = [...new Set(companyNames)];
    return uniqueCompanies.sort();
  };

  const createStock = async (
    name: string,
    baseQuantity: number,
    basePrice: number
  ): Promise<Stock | null> => {
    setIsStockLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsStockLoading(false);
      showErrorToast(t("mustBeConnectedToCreate"));
      return null;
    }

    const response = await apiClient.stock.create({
      name,
      baseQuantity,
      basePrice,
    });

    if (response instanceof ApiClientError) {
      console.error("Failed to create stock:", response.message);
      showErrorToast(t("errorCreating"));
      setIsStockLoading(false);
      return null;
    }

    getStocks();
    showSuccessToast(t("stockCreated"));
    setIsStockLoading(false);
    return response;
  };

  const updateStock = async (
    id: number,
    name?: string,
    baseQuantity?: number
  ): Promise<Stock | null> => {
    setIsStockLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsStockLoading(false);
      showErrorToast(t("mustBeConnectedToUpdate"));
      return null;
    }

    const response = await apiClient.stock.update({
      id,
      name,
      baseQuantity,
    });

    if (response instanceof ApiClientError) {
      console.error("Failed to update stock:", response.message);
      showErrorToast(t("errorUpdating"));
      setIsStockLoading(false);
      return null;
    }

    showSuccessToast(t("stockUpdated"));
    getStocks();
    setIsStockLoading(false);
    return response;
  };

  const refillStock = async (
    id: number,
    additionalQuantity: number
  ): Promise<Stock | null> => {
    setIsStockLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsStockLoading(false);
      showErrorToast(t("mustBeConnectedToUpdate"));
      return null;
    }

    const currentStock = stocks.find((s) => s.id === id);
    if (!currentStock) {
      setIsStockLoading(false);
      showErrorToast(t("errorUpdating"));
      return null;
    }

    const newBaseQuantity = currentStock.baseQuantity + additionalQuantity;

    const response = await apiClient.stock.update({
      id,
      baseQuantity: newBaseQuantity,
    });

    if (response instanceof ApiClientError) {
      console.error("Failed to refill stock:", response.message);
      showErrorToast(t("errorRefilling"));
      setIsStockLoading(false);
      return null;
    }

    showSuccessToast(t("stockRefilled"));
    getStocks();
    setIsStockLoading(false);
    return response;
  };

  const purchaseBaseStock = async (
    id: number,
    accountId: number
  ): Promise<boolean> => {
    setIsStockLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsStockLoading(false);
      showErrorToast(t("mustBeConnectedToPurchase"));
      return false;
    }

    const response = await apiClient.stock.purchaseBaseStock(id, { accountId });

    if (response instanceof ApiClientError) {
      console.error("Failed to purchase base stock:", response.message);
      showErrorToast(t("errorPurchasing"));
      setIsStockLoading(false);
      return false;
    }

    showSuccessToast(t("stockPurchased"));
    setIsStockLoading(false);
    return true;
  };

  return (
    <StocksContext.Provider
      value={{
        stock,
        stocks,
        isStockLoading,
        isStocksLoading,
        getStocks,
        getAvailableCompanies,
        createStock,
        updateStock,
        refillStock,
        purchaseBaseStock,
        setStock,
      }}
    >
      {children}
    </StocksContext.Provider>
  );
};

export const useStocks = () => {
  const context = useContext(StocksContext);
  if (!context) {
    throw new Error("useStocks must be used within a StocksProvider");
  }

  return context;
};
