'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from "react"

import { apiUrl } from "../../utils/tools";
import { SseApiClientInterface } from "../../../../application/services/sse/SseApiClientInterface";
import { SseApiClient } from "../../../adapters/sse/services/SseApiClient";
import { getCookie } from "../../../utils/frontend/cookies";

type Props = {
  children: ReactNode;
};

type SseApiClientContextType = {
  sseApiClient: SseApiClientInterface;
  setSseToken: (token: string) => void;
};

export const SseApiClientContext = createContext<SseApiClientContextType | undefined>(undefined);

export const SseApiClientProvider = ({ children }: Props) => {
  const [token, setSseToken] = useState<string>(getCookie('token') || '');
  const [sseApiClient, setSseApiClient] = useState<SseApiClientInterface>(new SseApiClient(apiUrl, token));

  useEffect(() => {
    setSseApiClient(new SseApiClient(apiUrl, token));
  }, [token]);

  return <SseApiClientContext.Provider value={{ sseApiClient, setSseToken }}>
    {children}
  </SseApiClientContext.Provider>;
}

export const useSseApiClient = () => {
  const context = useContext(SseApiClientContext);
  if (!context) {
    throw new Error('useSseApiClient must be used within an SseApiClientProvider');
  }

  return context;
}
