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
import { showErrorToast } from "@/lib/toast";
import { GetHydratedPrivateChannelResponseInterface } from "../../../../application/services/api/resources/PrivateChannelResourceInterface";
import { useApiClient } from "./ApiContext";
import { paths } from "../../../../application/services/api/paths";
import { WritingMessageUser } from "../../../../domain/entities/User";
import { WebsocketRessourceEnum } from "../../../../domain/enums/WebsocketRessourceEnum";

type Props = {
  children: ReactNode;
  ressource: WebsocketRessourceEnum;
  channelId: number;
};

type MessageContextType = {
  liveMessages: WebsocketMessage[];
  writingUsers: WritingMessageUser[];
  addMessage: (message: string) => void;
  requestAdvisorByMessage: (
    title: string,
    message: string
  ) => Promise<{ channel?: GetHydratedPrivateChannelResponseInterface }>;
  writingMessage: () => void;
  stopWritingMessage: () => void;
};

export const MessageContext = createContext<MessageContextType>({
  liveMessages: [],
  writingUsers: [],
  addMessage: () => {},
  requestAdvisorByMessage: () => Promise.resolve({ channel: undefined }),
  writingMessage: () => {},
  stopWritingMessage: () => {},
});

export const MessageProvider = ({ children, ressource, channelId }: Props) => {
  const [liveMessages, setLiveMessages] = useState<WebsocketMessage[]>([]);
  const [writingUsers, setWritingUsers] = useState<WritingMessageUser[]>([]);
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
          roles: user.roles,
        },
        channel: {
          id: msg.channelId,
          title: msg.channel?.title,
        },
      };

      websocketClient.emitMessage(websocketMessage, ressource);
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

  const writingMessage = useCallback(() => {
    websocketClient.emitWritingMessage(channelId, ressource);
  }, [websocketClient, channelId, ressource]);

  const stopWritingMessage = useCallback(() => {
    websocketClient.emitStopWritingMessage(channelId, ressource);
  }, [websocketClient, channelId, ressource]);

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
    websocketClient.onWritingMessage((writingUser => {
      setWritingUsers(prev => {
        if (
          writingUser.id === user?.id
          || prev.find(prevUser => prevUser.id === writingUser.id)
        ) {
          return prev;
        }

        return [...prev, writingUser];
      });
    }), ressource, channelId);
    websocketClient.onStopWritingMessage((user => {
      setWritingUsers(prev => prev.filter(prevUser => prevUser.id !== user.id));
    }), ressource, channelId);
  }, [websocketClient, user, ressource, channelId]);

  return (
    <MessageContext.Provider
      value={{
        liveMessages,
        writingUsers,
        addMessage,
        requestAdvisorByMessage,
        writingMessage,
        stopWritingMessage
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
