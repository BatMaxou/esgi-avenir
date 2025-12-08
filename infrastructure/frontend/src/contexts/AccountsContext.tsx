"use client";

import { createContext, ReactNode, useContext, useState } from "react";
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
import { toast } from "sonner";

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

  const createAccount = async (data: { name: string; isSavings: boolean }) => {
    setIsAccountsLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsAccountsLoading(false);
      toast.error("Vous devez être connecté pour créer un compte");
      return null;
    }

    const payload = { name: data.name };
    const response = data.isSavings
      ? await apiClient.account.createSavings(payload)
      : await apiClient.account.create(payload);

    if (response instanceof ApiClientError) {
      console.error("Failed to create account:", response.message);
      toast.error("Erreur lors de la création du compte");
      setIsAccountsLoading(false);
      return null;
    }

    toast.success(
      data.isSavings
        ? "Compte épargne créé avec succès"
        : "Compte courant créé avec succès"
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
      toast.error("Vous devez être connecté pour modifier un compte");
      return null;
    }

    const response = await apiClient.account.update({ id, ...data });

    if (response instanceof ApiClientError) {
      console.error("Failed to update account:", response.message);
      toast.error("Erreur lors de la modification du compte");
      setIsAccountLoading(false);
      return null;
    }

    toast.success("Compte modifié avec succès");
    await getAccount(id);
    setIsAccountLoading(false);
    return response;
  };

  const deleteAccount = async (id: number) => {
    setIsAccountLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsAccountLoading(false);
      toast.error("Vous devez être connecté pour supprimer un compte");
      return false;
    }

    // Vérifier si c'est l'unique compte courant
    const accountToDelete = accounts.find((acc) => acc.id === id);
    if (accountToDelete && !accountToDelete.isSavings) {
      const currentAccounts = accounts.filter((acc) => !acc.isSavings);
      if (currentAccounts.length === 1 && accountToDelete.amount !== 0) {
        toast.error(
          "Impossible de supprimer votre dernier compte courant s'il contient des fonds. Veuillez d'abord transférer les fonds ou créer un nouveau compte courant."
        );
        setIsAccountLoading(false);
        return false;
      }
    }

    const response = await apiClient.account.delete(id);

    if (response instanceof ApiClientError) {
      console.error("Failed to delete account:", response.message);
      toast.error("Erreur lors de la suppression du compte");
      setIsAccountLoading(false);
      return false;
    }

    toast.success("Compte supprimé avec succès");
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
