"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { useApiClient } from "./ApiContext";
import { getCookie } from "../../../utils/frontend/cookies";
import { User } from "../../../../domain/entities/User";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

type Props = {
  children: ReactNode;
};

type AuthContextType = {
  user: Pick<User, "id" | "firstName" | "lastName" | "email" | "roles"> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  me: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<boolean>;
  confirmRegistration: (token: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<Pick<
    User,
    "id" | "firstName" | "lastName" | "email" | "roles"
  > | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { apiClient } = useApiClient();
  const router = useRouter();

  const me = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await apiClient.me.get();

      if (response instanceof ApiClientError) {
        console.error("Failed to fetch user:", response.message);
        setUser(null);
      } else {
        setUser(response);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const response = await apiClient.login(email, password);

    if (response instanceof ApiClientError) {
      const errorMessage =
        String(response.message) === "Unauthorized"
          ? "Email ou mot de passe incorrect."
          : String(response.message) === "User account is not enabled yet."
          ? "Veuillez d'abord activer votre compte."
          : String(response.message) === "Invalid credentials."
          ? "Email ou mot de passe incorrect."
          : "Erreur de connexion";
      showErrorToast(errorMessage);
      setIsLoading(false);
    } else {
      await me();
      router.push("/home");
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    setIsLoading(true);
    const response = await apiClient.register(
      email,
      password,
      firstName,
      lastName
    );
    if (response instanceof ApiClientError) {
      const errorMessage =
        String(response.message) === "Given email already exists."
          ? "Cet email est déjà utilisé."
          : "Erreur lors de l'inscription.";
      showErrorToast(errorMessage);
      setIsLoading(false);
      return false;
    } else {
      setIsLoading(false);
      return true;
    }
  };

  const confirmRegistration = async (token: string) => {
    setIsLoading(true);
    const response = await apiClient.confirm(token);
    if (response instanceof ApiClientError) {
      showErrorToast("Erreur lors de la confirmation de l'inscription.");
      setTimeout(() => {
        router.push("/");
      }, 3000);
      return false;
    } else {
      setTimeout(() => {
        router.push("/");
      }, 3000);
      return true;
    }
  };

  const logout = async () => {
    apiClient.logout();
    setUser(null);
    showSuccessToast("Vous êtes déconnecté.");
    router.push("/");
  };

  const refreshUser = async () => {
    setIsLoading(true);
    await me();
  };

  useEffect(() => {
    me();
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        me,
        login,
        register,
        confirmRegistration,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
