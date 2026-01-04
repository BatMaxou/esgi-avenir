'use client';

import { createContext, ReactNode, useContext } from "react"

import { ApiClientInterface } from "../../../../application/services/api/ApiClientInterface";
import { ApiClient } from "../../../adapters/api/services/ApiClient";
import { apiUrl } from "../../utils/tools";
import { useWebsocketClient } from "./WebsocketContext";
import { useSseApiClient } from "./SseApiContext";

type Props = {
  children: ReactNode;
};

type ApiClientContextType = {
  apiClient: ApiClientInterface;
};

export const ApiClientContext = createContext<ApiClientContextType | undefined>(undefined);

export const ApiClientProvider = ({ children }: Props) => {
  const { setWebsocketToken } = useWebsocketClient();
  const { setSseToken } = useSseApiClient();

  return <ApiClientContext.Provider value={{ apiClient: new ApiClient(apiUrl, (token: string) => {
    setWebsocketToken(token);
    setSseToken(token);
  }) }}>
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
