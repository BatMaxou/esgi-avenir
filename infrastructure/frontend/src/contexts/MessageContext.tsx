'use client';

import { createContext, ReactNode, useEffect, useState, useCallback } from "react"

import { useAuth } from "./AuthContext";
import { Message, WebsocketMessage } from "../../../../domain/entities/Message";
import { useWebsocketClient } from "./WebsocketContext";
import { WebsocketRessourceEnum } from "../../../../application/services/websocket/WebsocketRessourceEnum";

type Props = {
  children: ReactNode;
  ressource: WebsocketRessourceEnum;
  channelId: number;
};

type MessageContextType = {
  liveMessages: WebsocketMessage[];
  addMessage: (message: string) => void;
};

export const MessageContext = createContext<MessageContextType>({
  liveMessages: [],
  addMessage: () => {},
});

export const MessageProvider = ({ children, ressource, channelId }: Props) => {
  const [liveMessages, setLiveMessages] = useState<WebsocketMessage[]>([]);
  const { user } = useAuth();
  const { websocketClient } = useWebsocketClient();

  const addMessage = useCallback((message: string) => {
    if (!user) {
      return;
    }

    const msg = Message.from({
      content: message,
      userId: user?.id,
      channelId,
    });
    if (msg instanceof Error) {
      console.error(msg);
      return;
    }

    const websocketMessage = {
      id: Date.now(),
      content: msg.content,
      user: {
        id: msg.userId,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      channel: {
        id: msg.channelId,
        title: msg.channel?.title,
      }
    };

    websocketClient.emitMessage(websocketMessage, ressource, channelId);
  }, [websocketClient, user, ressource, channelId]);

  useEffect(() => {
    if (!user || !user.id) {
      return;
    }

    websocketClient.join(ressource, channelId);
  }, [user, websocketClient, ressource, channelId]);

  useEffect(() => {
    if (!user || !user.id) {
      return;
    }

    websocketClient.join(ressource, channelId);
    websocketClient.onMessage((message => {
      setLiveMessages(prev => [...prev, message]);
    }), ressource, channelId);
  }, [websocketClient, user, ressource, channelId]);

  return <MessageContext.Provider value={{ liveMessages, addMessage }}>
    {children}
  </MessageContext.Provider>;
}
