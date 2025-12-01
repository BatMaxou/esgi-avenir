"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { useApiClient } from "./ApiContext";
import { getCookie } from "../../../utils/frontend/cookies";
import { GetAccountListResponseInterface } from "../../../../application/services/api/resources/AccountResourceInterface";
import { HydratedAccount } from "../../../../domain/entities/Account";
import { useAuth } from "./AuthContext";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { GetUserResponseInterface } from "../../../../application/services/api/resources/UserResourceInterface";
import { Operation } from "../../../../domain/entities/Operation";

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
  refreshAccounts: () => Promise<void>;
};

export const AccountsContext = createContext<AccountsContextType | undefined>(
  undefined
);

export const AccountsProvider = ({ children }: Props) => {
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

  const refreshAccounts = async () => {
    await getAccounts();
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
        refreshAccounts,
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
