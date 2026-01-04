"use client";

import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";

import { useAuth } from "./AuthContext";
import { Message, WebsocketMessage } from "../../../../domain/entities/Message";
import { useWebsocketClient } from "./WebsocketContext";
import { WebsocketRessourceEnum } from "../../../../application/services/websocket/WebsocketRessourceEnum";
import { showErrorToast } from "@/lib/toast";
import { GetHydratedPrivateChannelResponseInterface } from "../../../../application/services/api/resources/PrivateChannelResourceInterface";
import { useApiClient } from "./ApiContext";
import { paths } from "../../../../application/services/api/paths";

type Props = {
  children: ReactNode;
  ressource: WebsocketRessourceEnum;
  channelId: number;
};

type MessageContextType = {
  liveMessages: WebsocketMessage[];
  addMessage: (message: string) => void;
  requestAdvisorByMessage: (
    title: string,
    message: string
  ) => Promise<{ channel?: GetHydratedPrivateChannelResponseInterface }>;
};

export const MessageContext = createContext<MessageContextType>({
  liveMessages: [],
  addMessage: () => {},
  requestAdvisorByMessage: () => Promise.resolve({ channel: undefined }),
});

export const MessageProvider = ({ children, ressource, channelId }: Props) => {
  const [liveMessages, setLiveMessages] = useState<WebsocketMessage[]>([]);
  const { user } = useAuth();
  const { websocketClient } = useWebsocketClient();
  const { apiClient } = useApiClient();

  const addMessage = useCallback(
    (message: string) => {
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
        },
      };

      websocketClient.emitMessage(websocketMessage, ressource, channelId);
    },
    [websocketClient, user, ressource, channelId]
  );

  const requestAdvisorByMessage = useCallback(
    async (
      title: string,
      message: string
    ): Promise<{ channel?: GetHydratedPrivateChannelResponseInterface }> => {
      if (!user) {
        return { channel: undefined };
      }

      try {
        const response =
          await apiClient.post<GetHydratedPrivateChannelResponseInterface>(
            paths.privateMessage.create,
            {
              title,
              content: message,
            }
          );

        if (response instanceof Error) {
          showErrorToast(response.message);
          return { channel: undefined };
        }

        return { channel: response };
      } catch (error) {
        showErrorToast("Failed to create private message");
        return { channel: undefined };
      }
    },
    [apiClient, user]
  );

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
    websocketClient.onMessage(
      (message) => {
        setLiveMessages((prev) => [...prev, message]);
      },
      ressource,
      channelId
    );
  }, [websocketClient, user, ressource, channelId]);

  return (
    <MessageContext.Provider
      value={{ liveMessages, addMessage, requestAdvisorByMessage }}
    >
      {children}
    </MessageContext.Provider>
  );
};
