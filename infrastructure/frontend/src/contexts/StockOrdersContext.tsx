"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useTranslations } from "next-intl";
import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { useApiClient } from "./ApiContext";
import { getCookie } from "../../../utils/frontend/cookies";
import { StockOrder } from "../../../../domain/entities/StockOrder";
import { StockOrderTypeEnum } from "../../../../domain/enums/StockOrderTypeEnum";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

type Props = {
  children: ReactNode;
};

type StockOrdersContextType = {
  stockOrder: StockOrder | null;
  stockOrders: StockOrder[];
  matchedStockOrders: StockOrder[];
  isStockOrderLoading: boolean;
  isStockOrdersLoading: boolean;
  isMatchedStockOrdersLoading: boolean;
  getStockOrders: () => Promise<void>;
  getAllMatch: (id: number) => Promise<void>;
  deleteStockOrder: (id: number) => Promise<boolean>;
  createBuyStockOrder: (
    stockId: number,
    accountId: number,
    amount: number
  ) => Promise<StockOrder | null>;
  createSellStockOrder: (
    stockId: number,
    accountId: number,
    amount: number
  ) => Promise<StockOrder | null>;
  acceptStockOrder: (id: number, withId: number) => Promise<boolean>;
};

export const StockOrdersContext = createContext<
  StockOrdersContextType | undefined
>(undefined);

export const StockOrdersProvider = ({ children }: Props) => {
  const t = useTranslations("contexts.stockOrders");
  const [stockOrder, setStockOrder] = useState<StockOrder | null>(null);
  const [stockOrders, setStockOrders] = useState<StockOrder[]>([]);
  const [matchedStockOrders, setMatchedStockOrders] = useState<StockOrder[]>(
    []
  );
  const [isStockOrdersLoading, setIsStockOrdersLoading] =
    useState<boolean>(false);
  const [isMatchedStockOrdersLoading, setIsMatchedStockOrdersLoading] =
    useState<boolean>(false);
  const [isStockOrderLoading, setIsStockOrderLoading] =
    useState<boolean>(false);
  const { apiClient } = useApiClient();

  const getStockOrders = async () => {
    setIsStockOrdersLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsStockOrdersLoading(false);
      showErrorToast(t("mustBeConnectedToView"));
      return;
    }

    const response = await apiClient.stockOrder.getAll();

    if (response instanceof ApiClientError) {
      console.error("Failed to fetch stock orders:", response.message);
      showErrorToast(t("errorFetching"));
      setStockOrders([]);
    } else {
      setStockOrders(response);
    }

    setIsStockOrdersLoading(false);
  };

  const getAllMatch = async (id: number) => {
    setIsMatchedStockOrdersLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsMatchedStockOrdersLoading(false);
      showErrorToast(t("mustBeConnectedToView"));
      return;
    }

    const response = await apiClient.stockOrder.match(id);

    if (response instanceof ApiClientError) {
      console.error("Failed to fetch matching stock orders:", response.message);
      showErrorToast(t("errorFetching"));
      setMatchedStockOrders([]);
    } else {
      setMatchedStockOrders(response);
    }

    setIsMatchedStockOrdersLoading(false);
  };

  const deleteStockOrder = async (id: number): Promise<boolean> => {
    setIsStockOrderLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsStockOrderLoading(false);
      showErrorToast(t("mustBeConnectedToDelete"));
      return false;
    }

    const response = await apiClient.stockOrder.delete(id);

    if (response instanceof ApiClientError) {
      console.error("Failed to delete stock order:", response.message);
      showErrorToast(t("errorDeleting"));
      setIsStockOrderLoading(false);
      return false;
    }

    showSuccessToast(t("orderDeleted"));
    setStockOrders(stockOrders.filter((order) => order.id !== id));
    setIsStockOrderLoading(false);
    return true;
  };

  const createBuyStockOrder = async (
    stockId: number,
    accountId: number,
    amount: number
  ): Promise<StockOrder | null> => {
    setIsStockOrderLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsStockOrderLoading(false);
      showErrorToast(t("mustBeConnectedToCreate"));
      return null;
    }

    const response = await apiClient.stockOrder.create({
      stockId,
      accountId,
      type: StockOrderTypeEnum.BUY,
      amount,
    });

    if (response instanceof ApiClientError) {
      console.error("Failed to create buy stock order:", response.message);
      showErrorToast(t("errorCreating"));
      setIsStockOrderLoading(false);
      return null;
    }

    showSuccessToast(t("orderCreated"));
    setStockOrders([...stockOrders, response]);
    setIsStockOrderLoading(false);
    return response;
  };

  const createSellStockOrder = async (
    stockId: number,
    accountId: number,
    amount: number
  ): Promise<StockOrder | null> => {
    setIsStockOrderLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsStockOrderLoading(false);
      showErrorToast(t("mustBeConnectedToCreate"));
      return null;
    }

    const response = await apiClient.stockOrder.create({
      stockId,
      accountId,
      type: StockOrderTypeEnum.SELL,
      amount,
    });

    if (response instanceof ApiClientError) {
      console.error("Failed to create sell stock order:", response.message);
      showErrorToast(t("errorCreating"));
      setIsStockOrderLoading(false);
      return null;
    }

    showSuccessToast(t("orderCreated"));
    setStockOrders([...stockOrders, response]);
    setIsStockOrderLoading(false);
    return response;
  };

  const acceptStockOrder = async (
    id: number,
    withId: number
  ): Promise<boolean> => {
    setIsStockOrderLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsStockOrderLoading(false);
      showErrorToast(t("mustBeConnectedToUpdate"));
      return false;
    }

    const response = await apiClient.stockOrder.accept(id, withId);

    if (response instanceof ApiClientError) {
      console.error("Failed to accept stock order:", response.message);

      let errorMessage = t("errorUpdating");

      switch (response.message) {
        case "StockOrder not found.":
          errorMessage = t("errors.stockOrderNotFound");
          break;
        case "Stock orders must be for the same stock.":
          errorMessage = t("errors.stockMismatch");
          break;
        case "Only pending stock orders can be accepted.":
          errorMessage = t("errors.invalidStatus");
          break;
        case "Stock orders must be of different types (one BUY, one SELL).":
          errorMessage = t("errors.invalidType");
          break;
        case "Seller owner not found.":
          errorMessage = t("errors.sellerNotFound");
          break;
        case "Financial security not found for the given stock and seller owner.":
          errorMessage = t("errors.financialSecurityNotFound");
          break;
        case "Insufficient funds for buyer account.":
          errorMessage = t("errors.insufficientFundsBuyer");
          break;
        case "Insufficient funds for seller account.":
          errorMessage = t("errors.insufficientFundsSeller");
          break;
      }

      if (response.message.includes("Account not found")) {
        errorMessage = t("errors.accountNotFound");
      }

      showErrorToast(errorMessage);
      setIsStockOrderLoading(false);
      return false;
    }
    showSuccessToast(t("orderUpdated"));
    setIsStockOrderLoading(false);
    getStockOrders();
    return true;
  };

  return (
    <StockOrdersContext.Provider
      value={{
        stockOrder,
        stockOrders,
        matchedStockOrders,
        isStockOrderLoading,
        isStockOrdersLoading,
        isMatchedStockOrdersLoading,
        getStockOrders,
        getAllMatch,
        deleteStockOrder,
        createBuyStockOrder,
        createSellStockOrder,
        acceptStockOrder,
      }}
    >
      {children}
    </StockOrdersContext.Provider>
  );
};

export const useStockOrders = () => {
  const context = useContext(StockOrdersContext);
  if (!context) {
    throw new Error("useStockOrders must be used within a StockOrdersProvider");
  }

  return context;
};
