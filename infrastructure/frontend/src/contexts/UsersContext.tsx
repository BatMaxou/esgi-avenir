"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { useApiClient } from "./ApiContext";
import { useAuth } from "./AuthContext";
import { getCookie } from "../../../utils/frontend/cookies";
import {
  GetUserResponseInterface,
  CreateUserPayloadInterface,
  UpdateUserPayloadInterface,
} from "../../../../application/services/api/resources/UserResourceInterface";
import { User } from "../../../../domain/entities/User";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

type Props = {
  children: ReactNode;
};

type UsersContextType = {
  user: GetUserResponseInterface | null;
  users: User[];
  isUserLoading: boolean;
  isUsersLoading: boolean;
  getUser: (id: number) => Promise<void>;
  getUsers: () => Promise<void>;
  getClients: () => Promise<void>;
  createUser: (
    data: CreateUserPayloadInterface
  ) => Promise<GetUserResponseInterface | null>;
  updateUser: (
    data: UpdateUserPayloadInterface
  ) => Promise<GetUserResponseInterface | null>;
  deleteUser: (id: number) => Promise<boolean>;
  banUser: (id: number) => Promise<GetUserResponseInterface | null>;
  unbanUser: (id: number) => Promise<GetUserResponseInterface | null>;
};

export const UsersContext = createContext<UsersContextType | undefined>(
  undefined
);

export const UsersProvider = ({ children }: Props) => {
  const [user, setUser] = useState<GetUserResponseInterface | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
  const [isUsersLoading, setIsUsersLoading] = useState<boolean>(false);
  const { apiClient } = useApiClient();
  const { user: authUser, me } = useAuth();

  const getUser = async (id: number) => {
    setIsUserLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsUserLoading(false);
      return;
    }

    const response = await apiClient.user.get(id);

    if (response instanceof ApiClientError) {
      console.error("Failed to fetch user:", response.message);
      setUser(null);
    } else {
      setUser(response);
    }

    setIsUserLoading(false);
  };

  const getUsers = async () => {
    setIsUsersLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsUsersLoading(false);
      return;
    }

    const response = await apiClient.user.getAll();

    if (response instanceof ApiClientError) {
      console.error("Failed to fetch users:", response.message);
      setUsers([]);
    } else {
      const userList = response.map(
        (userData) =>
          ({
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            roles: userData.roles || [],
            enabled: false,
            confirmationToken: null,
            isDeleted: false,
          } as User)
      );

      const sortedUserList = userList.sort((a, b) => {
        const getRoleOrder = (roles: string[]) => {
          if (roles.includes(RoleEnum.BANNED)) return 3;
          if (roles.includes(RoleEnum.DIRECTOR)) return 0;
          if (roles.includes(RoleEnum.ADVISOR)) return 1;
          return 2;
        };

        return getRoleOrder(a.roles) - getRoleOrder(b.roles);
      });

      setUsers(sortedUserList);
    }

    setIsUsersLoading(false);
  };

  const getClients = async () => {
    setIsUsersLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsUsersLoading(false);
      return;
    }

    const response = await apiClient.user.getAll();

    if (response instanceof ApiClientError) {
      console.error("Failed to fetch users:", response.message);
      setUsers([]);
    } else {
      const clientList = response
        .map(
          (userData) =>
            ({
              id: userData.id,
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              roles: userData.roles || [],
              enabled: false,
              confirmationToken: null,
              isDeleted: false,
            } as User)
        )
        .filter(
          (user) =>
            user.roles.length === 1 && user.roles.includes(RoleEnum.USER)
        );

      const sortedUserList = clientList.sort((a, b) => {
        return a.lastName.localeCompare(b.lastName);
      });

      setUsers(sortedUserList);
    }

    setIsUsersLoading(false);
  };

  const createUser = async (
    data: CreateUserPayloadInterface
  ): Promise<GetUserResponseInterface | null> => {
    setIsUsersLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsUsersLoading(false);
      showErrorToast("Vous devez être connecté pour créer un utilisateur");
      return null;
    }

    const response = await apiClient.user.create(data);

    if (response instanceof ApiClientError) {
      console.error("Failed to create user:", response.message);
      showErrorToast("Erreur lors de la création de l'utilisateur");
      setIsUsersLoading(false);
      return null;
    }

    showSuccessToast("Utilisateur créé avec succès");
    await getUsers();
    setIsUsersLoading(false);
    return response;
  };

  const updateUser = async (
    data: UpdateUserPayloadInterface
  ): Promise<GetUserResponseInterface | null> => {
    setIsUserLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsUserLoading(false);
      showErrorToast("Vous devez être connecté pour modifier un utilisateur");
      return null;
    }

    const response = await apiClient.user.update(data);

    if (response instanceof ApiClientError) {
      console.error("Failed to update user:", response.message);
      showErrorToast("Erreur lors de la modification de l'utilisateur");
      setIsUserLoading(false);
      return null;
    }

    showSuccessToast("Utilisateur modifié avec succès");
    await getUser(data.id);
    if (authUser?.id === data.id) {
      await me();
    }
    setIsUserLoading(false);
    return response;
  };

  const deleteUser = async (id: number): Promise<boolean> => {
    setIsUserLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsUserLoading(false);
      showErrorToast("Vous devez être connecté pour supprimer un utilisateur");
      return false;
    }

    const response = await apiClient.user.delete(id);

    if (response instanceof ApiClientError) {
      console.error("Failed to delete user:", response.message);
      showErrorToast("Erreur lors de la suppression de l'utilisateur");
      setIsUserLoading(false);
      return false;
    }

    showSuccessToast("Utilisateur supprimé avec succès");
    await getUsers();
    setIsUserLoading(false);
    return true;
  };

  const banUser = async (
    id: number
  ): Promise<GetUserResponseInterface | null> => {
    setIsUserLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsUserLoading(false);
      showErrorToast("Vous devez être connecté pour bannir un utilisateur");
      return null;
    }

    const response = await apiClient.user.ban(id);

    if (response instanceof ApiClientError) {
      console.error("Failed to ban user:", response.message);
      showErrorToast("Erreur lors du bannissement de l'utilisateur");
      setIsUserLoading(false);
      return null;
    }

    showSuccessToast("Utilisateur banni avec succès");
    await getUser(id);
    setIsUserLoading(false);
    return response;
  };

  const unbanUser = async (
    id: number
  ): Promise<GetUserResponseInterface | null> => {
    setIsUserLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsUserLoading(false);
      showErrorToast("Vous devez être connecté pour débannir un utilisateur");
      return null;
    }

    const response = await apiClient.user.unban(id);

    if (response instanceof ApiClientError) {
      console.error("Failed to unban user:", response.message);
      showErrorToast("Erreur lors du débannissement de l'utilisateur");
      setIsUserLoading(false);
      return null;
    }

    showSuccessToast("Utilisateur débanni avec succès");
    await getUser(id);
    setIsUserLoading(false);
    return response;
  };

  return (
    <UsersContext.Provider
      value={{
        user,
        users,
        isUserLoading,
        isUsersLoading,
        getUser,
        getUsers,
        getClients,
        createUser,
        updateUser,
        deleteUser,
        banUser,
        unbanUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }

  return context;
};
