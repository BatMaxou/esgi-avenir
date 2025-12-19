"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useTranslations } from "next-intl";
import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { useApiClient } from "./ApiContext";
import { getCookie } from "../../../utils/frontend/cookies";
import {
  GetAccountListResponseInterface,
  GetAccountResponseInterface,
} from "../../../../application/services/api/resources/AccountResourceInterface";
import { HydratedAccount } from "../../../../domain/entities/Account";
import { useAuth } from "./AuthContext";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { GetUserResponseInterface } from "../../../../application/services/api/resources/UserResourceInterface";
import { Operation } from "../../../../domain/entities/Operation";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

type Props = {
  children: ReactNode;
};

export type HydratedAccountWithOperations = HydratedAccount & {
  operations: Operation[];
};

type AccountsContextType = {
  account: HydratedAccountWithOperations | null;
  accounts: HydratedAccount[];
  isAccountLoading: boolean;
  isAccountsLoading: boolean;
  getAccount: (id: number) => Promise<void>;
  getAccounts: () => Promise<void>;
  getUserAccounts: (id: number) => Promise<void>;
  refreshAccounts: () => Promise<void>;
  createAccount: (data: {
    name: string;
    isSavings: boolean;
  }) => Promise<GetAccountResponseInterface | null>;
  updateAccount: (
    id: number,
    data: { name: string }
  ) => Promise<GetAccountResponseInterface | null>;
  deleteAccount: (id: number) => Promise<boolean>;
};

export const AccountsContext = createContext<AccountsContextType | undefined>(
  undefined
);

export const AccountsProvider = ({ children }: Props) => {
  const t = useTranslations("contexts.accounts");
  const [account, setAccount] = useState<HydratedAccountWithOperations | null>(
    null
  );
  const [accounts, setAccounts] = useState<HydratedAccount[]>([]);
  const [isAccountsLoading, setIsAccountsLoading] = useState<boolean>(false);
  const [isAccountLoading, setIsAccountLoading] = useState<boolean>(false);
  const { apiClient } = useApiClient();
  const { user } = useAuth();

  const getAccount = async (id: number) => {
    setIsAccountLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsAccountLoading(false);
      return;
    }

    if (!user) {
      setIsAccountLoading(false);
      return;
    }

    const response = await apiClient.account.get(id);

    if (response instanceof ApiClientError) {
      console.error("Failed to fetch account:", response.message);
    } else {
      setAccount({ ...response, operations: [] });
      if (user?.roles.includes(RoleEnum.DIRECTOR || RoleEnum.ADVISOR)) {
        const ownerResponse: GetUserResponseInterface | ApiClientError =
          await apiClient.user.get(response.ownerId);
        if (ownerResponse instanceof ApiClientError) {
          console.error(
            "Failed to fetch account owner:",
            ownerResponse.message
          );
        } else {
          setAccount((prevAccount) =>
            prevAccount
              ? ({
                  ...prevAccount,
                  owner: ownerResponse,
                } as HydratedAccountWithOperations)
              : prevAccount
          );
        }
      } else {
        setAccount((prevAccount) =>
          prevAccount
            ? ({
                ...prevAccount,
                owner: {
                  id: user?.id,
                  firstName: user?.firstName,
                  lastName: user?.lastName,
                  email: user?.email,
                  roles: user?.roles,
                },
              } as HydratedAccountWithOperations)
            : prevAccount
        );
      }
    }
    const accountOperationsResponse = await apiClient.account.getOperations(id);
    if (accountOperationsResponse instanceof ApiClientError) {
      console.error(
        "Failed to fetch account operations:",
        accountOperationsResponse.message
      );
    } else {
      setAccount((prevAccount) =>
        prevAccount
          ? ({
              ...prevAccount,
              operations: accountOperationsResponse,
            } as HydratedAccountWithOperations)
          : prevAccount
      );
    }

    setIsAccountLoading(false);
  };

  const getAccounts = async () => {
    setIsAccountsLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsAccountsLoading(false);
      return;
    }

    const response: GetAccountListResponseInterface | ApiClientError =
      await apiClient.account.getAll();

    if (response instanceof ApiClientError) {
      console.error("Failed to fetch accounts:", response.message);
      setAccounts([]);
    } else {
      setAccounts(response);
    }

    setIsAccountsLoading(false);
  };

  const getUserAccounts = async (id: number) => {
    setIsAccountsLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsAccountsLoading(false);
    }

    if (!id) {
      setIsAccountsLoading(false);
      showErrorToast(t("userNotFound"));
    }

    const response: GetAccountListResponseInterface | ApiClientError =
      await apiClient.account.getByUser(id);

    let userAccounts: HydratedAccount[] = [];

    if (response instanceof ApiClientError) {
      console.error("Failed to fetch accounts:", response.message);
      userAccounts = [];
    } else {
      userAccounts = response;
    }

    setIsAccountsLoading(false);
    setAccounts(userAccounts);
  };

  const refreshAccounts = async () => {
    await getAccounts();
  };

  const createAccount = async (data: { name: string; isSavings: boolean }) => {
    setIsAccountsLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsAccountsLoading(false);
      showErrorToast(t("mustBeConnectedToCreate"));
      return null;
    }

    const payload = { name: data.name };
    const response = data.isSavings
      ? await apiClient.account.createSavings(payload)
      : await apiClient.account.create(payload);

    if (response instanceof ApiClientError) {
      console.error("Failed to create account:", response.message);
      showErrorToast(t("errorCreating"));
      setIsAccountsLoading(false);
      return null;
    }

    showSuccessToast(
      data.isSavings ? t("savingsAccountCreated") : t("currentAccountCreated")
    );
    await refreshAccounts();
    setIsAccountsLoading(false);
    return response;
  };

  const updateAccount = async (id: number, data: { name: string }) => {
    setIsAccountLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsAccountLoading(false);
      showErrorToast(t("mustBeConnectedToUpdate"));
      return null;
    }

    const response = await apiClient.account.update({ id, ...data });

    if (response instanceof ApiClientError) {
      console.error("Failed to update account:", response.message);
      showErrorToast(t("errorUpdating"));
      setIsAccountLoading(false);
      return null;
    }

    showSuccessToast(t("accountUpdated"));
    await getAccount(id);
    setIsAccountLoading(false);
    return response;
  };

  const deleteAccount = async (id: number) => {
    setIsAccountLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsAccountLoading(false);
      showErrorToast(t("mustBeConnectedToDelete"));
      return false;
    }

    // Vérifier si c'est l'unique compte courant
    const accountToDelete = accounts.find((acc) => acc.id === id);
    if (accountToDelete && !accountToDelete.isSavings) {
      const currentAccounts = accounts.filter((acc) => !acc.isSavings);
      if (currentAccounts.length === 1 && accountToDelete.amount !== 0) {
        showErrorToast(t("cannotDeleteLastCurrentWithFunds"));
        setIsAccountLoading(false);
        return false;
      }
    }

    const response = await apiClient.account.delete(id);

    if (response instanceof ApiClientError) {
      console.error("Failed to delete account:", response.message);
      if (
        response.code === 400 &&
        response.message === "Account is not soldable."
      ) {
        showErrorToast(t("accountNotSoldable"));
      } else {
        showErrorToast(t("errorDeleting"));
      }
      setIsAccountLoading(false);
      return false;
    }

    showSuccessToast(t("accountDeleted"));
    await refreshAccounts();
    setIsAccountLoading(false);
    return true;
  };

  return (
    <AccountsContext.Provider
      value={{
        account,
        accounts,
        isAccountLoading,
        isAccountsLoading,
        getAccount,
        getAccounts,
        getUserAccounts,
        refreshAccounts,
        createAccount,
        updateAccount,
        deleteAccount,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccounts = () => {
  const context = useContext(AccountsContext);
  if (!context) {
    throw new Error("useAccounts must be used within an AccountsProvider");
  }

  return context;
};
