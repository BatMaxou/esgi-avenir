'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from "react"

import { apiUrl } from "../../utils/tools";
import { SocketIoClient } from "../../../adapters/socket-io/SocketIoClient";
import { WebsocketClientInterface } from "../../../../application/services/websocket/WebsocketClientInterface";
import { getCookie } from "../../../utils/frontend/cookies";

type Props = {
  children: ReactNode;
};

type WebsocketClientContextType = {
  websocketClient: WebsocketClientInterface;
  setWebsocketToken: (token: string) => void;
};

export const WebsocketClientContext = createContext<WebsocketClientContextType | undefined>(undefined);

export const WebsocketClientProvider = ({ children }: Props) => {
  const [token, setWebsocketToken] = useState<string>(getCookie('token') || '');
  const [websocketClient, setWebsocketClient] = useState<WebsocketClientInterface>(new SocketIoClient(apiUrl, token));

  useEffect(() => {
    setWebsocketClient(new SocketIoClient(apiUrl, token));
  }, [token]);

  return <WebsocketClientContext.Provider value={{ websocketClient, setWebsocketToken }}>
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
