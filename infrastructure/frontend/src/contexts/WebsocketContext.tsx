'use client';

import { createContext, ReactNode, useContext, useState } from "react"

import { apiUrl } from "../../utils/tools";
import { SocketIoClient } from "../../../adapters/socket-io/SocketIoClient";
import { WebsocketClientInterface } from "../../../../application/services/websocket/WebsocketClientInterface";
import { getCookie } from "../../../utils/frontend/cookies";

type Props = {
  children: ReactNode;
};

type WebsocketClientContextType = {
  websocketClient: WebsocketClientInterface;
};

export const WebsocketClientContext = createContext<WebsocketClientContextType | undefined>(undefined);

export const WebsocketClientProvider = ({ children }: Props) => {
  const [websocketClient] = useState<WebsocketClientInterface>(new SocketIoClient(apiUrl, getCookie('token') || ''));

  return <WebsocketClientContext.Provider value={{ websocketClient }}>
    {children}
  </WebsocketClientContext.Provider>;
}

export const useWebsocketClient = () => {
  const context = useContext(WebsocketClientContext);
  if (!context) {
    throw new Error('useWebsocketClient must be used within an WebsocketClientProvider');
  }

  return context;
}
