'use client';

import { createContext, ReactNode, useContext } from "react"

import { apiUrl } from "../../utils/tools";
import { SseApiClientInterface } from "../../../../application/services/sse/SseApiClientInterface";
import { SseApiClient } from "../../../adapters/sse/services/SseApiClient";

type Props = {
  children: ReactNode;
};

type SseApiClientContextType = {
  sseApiClient: SseApiClientInterface;
};

export const SseApiClientContext = createContext<SseApiClientContextType | undefined>(undefined);

export const SseApiClientProvider = ({ children }: Props) => {
  return <SseApiClientContext.Provider value={{ sseApiClient: new SseApiClient(apiUrl) }}>
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
