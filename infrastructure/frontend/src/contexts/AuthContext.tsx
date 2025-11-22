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

type Props = {
  children: ReactNode;
};

type AuthContextType = {
  user: Pick<User, "id" | "firstName" | "lastName" | "email" | "roles"> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  me: () => Promise<void>;
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

  const logout = async () => {
    await apiClient.logout();
    setUser(null);
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
