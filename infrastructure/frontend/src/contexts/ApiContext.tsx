'use client';

import { createContext, ReactNode, useContext } from "react"

import { ApiClientInterface } from "../../../../application/services/api/ApiClientInterface";
import { ApiClient } from "../../../adapters/services/api/ApiClient";
import { apiUrl } from "../../utils/tools";

type Props = {
  children: ReactNode;
};

type ApiClientContextType = {
  apiClient: ApiClientInterface;
};

export const ApiClientContext = createContext<ApiClientContextType | undefined>(undefined);

export const ApiClientProvider = ({ children }: Props) => {
  return <ApiClientContext.Provider value={{ apiClient: new ApiClient(apiUrl) }}>
    {children}
  </ApiClientContext.Provider>;
}

export const useApiClient = () => {
  const context = useContext(ApiClientContext);
  if (!context) {
    throw new Error('useApiClient must be used within an ApiClientProvider');
  }

  return context;
}
