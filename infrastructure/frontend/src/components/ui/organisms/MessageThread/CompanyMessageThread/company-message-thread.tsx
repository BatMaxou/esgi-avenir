"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { useAuth } from "@/contexts/AuthContext";
import { MessageContext } from "@/contexts/MessageContext";
import { useApiClient } from "@/contexts/ApiContext";
import { Message } from "../../../../../../../../domain/entities/Message";
import { ApiClientError } from "../../../../../../../../application/services/api/ApiClientError";
import { SendMessageForm } from "@/components/ui/molecules/forms/form-send-message";
import { MessageItem } from "@/components/ui/atoms/message";
import { useChannel } from "@/contexts/ChannelContext";

export default function PrivateMessageThread({
  channelId,
}: {
  channelId: number;
}) {
  const [staticMessages, setStaticMessages] = useState<Message[]>([]);
  const { user } = useAuth();
  const { apiClient } = useApiClient();
  const { liveMessages } = useContext(MessageContext);
  const { getCompanyChannelById } = useChannel();
  const t = useTranslations("page.privateMessage");
  const ulRef = useRef<HTMLUListElement>(null);

  const scrollToBottom = useCallback(() => {
    if (ulRef.current) {
      ulRef.current.scrollTo(0, ulRef.current.scrollHeight);
    }
  }, [ulRef]);

  useEffect(() => {
    if (user && channelId) {
      getCompanyChannelById(channelId).then((response) => {
        if (!(response instanceof ApiClientError)) {
          setStaticMessages(response.messages?.reverse());
        }
      });
    }
  }, [apiClient, user, channelId]);

  useEffect(() => {
    scrollToBottom();
  }, [liveMessages, staticMessages, scrollToBottom]);

  return (
    <div className="h-full shadow-md bg-white rounded-lg">
      <div className="flex flex-col gap-6 h-full justify-between rounded-md shadow-sm pb-2">
        {staticMessages.length === 0 && liveMessages.length === 0 ? (
          <div className="flex flex-col justify-center items-center gap-2 h-full overflow-y-auto p-4 pt-8">
            <span className="text-center">{t("no-results")}</span>
          </div>
        ) : (
          <ul
            ref={ulRef}
            className="flex flex-col gap-2 h-full overflow-y-auto p-4 pt-8"
          >
            {staticMessages.map((message) => (
              <MessageItem key={message.id} message={message} user={user} />
            ))}
            {liveMessages.map((message) => (
              <MessageItem key={message.id} message={message} user={user} />
            ))}
          </ul>
        )}
        <div className="px-2">
          <SendMessageForm />
        </div>
      </div>
    </div>
  );
}
