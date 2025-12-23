'use client';

import { notFound, useParams } from "next/navigation";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useTranslations } from 'next-intl';

import { useAuth } from "@/contexts/AuthContext";
import { MessageContext } from "@/contexts/MessageContext";
import { useApiClient } from "@/contexts/ApiContext";
import { Message } from "../../../../../../../../domain/entities/Message";
import { ApiClientError } from "../../../../../../../../application/services/api/ApiClientError";
import { SendMessageForm } from "@/components/ui/molecules/forms/form-send-message";
import { MessageItem } from "@/components/ui/atoms/message";

export default function PrivateMessagePage() {
  const { channelId } = useParams();
  const [isFoundChannel, setIsChannel] = useState<boolean|undefined>(undefined);
  const [staticMessages, setStaticMessages] = useState<Message[]>([]);
  const { user, isLoading } = useAuth();
  const { apiClient } = useApiClient();
  const { liveMessages } = useContext(MessageContext);
  const t = useTranslations('page.privateMessage');
  const ulRef = useRef<HTMLUListElement>(null);

  const scrollToBottom = useCallback(() => {
    if (ulRef.current) {
      ulRef.current.scrollTo(0, ulRef.current.scrollHeight);
    }
  }, [ulRef]);

  useEffect(() => {
    if (user && typeof channelId === 'string') {
      apiClient.privateChannel.get(parseInt(channelId))
        .then((response) => {
          if (!(response instanceof ApiClientError)) {
            setIsChannel(true);
            setStaticMessages(response.messages?.reverse());
          } else {
            setIsChannel(false);
          }
        });
    }
  }, [apiClient, user, channelId]);

  useEffect(() => {
    scrollToBottom();
  }, [liveMessages, staticMessages, scrollToBottom]);

  if ((!user && !isLoading) || isFoundChannel === false) {
    notFound();
  }

  return <div>
    <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
    {staticMessages.length === 0 ? (
      <p>{t('no-results')}</p>
    ) : (
      <div className="flex flex-col gap-6">
        <ul ref={ulRef} className="flex flex-col gap-6 max-h-[50dvh] overflow-y-auto p-4 pt-8 border-y rounded-md shadow-sm">
          {staticMessages.map((message) => <MessageItem key={message.id} message={message} user={user} />)}
          {liveMessages.map((message) => <MessageItem key={message.id} message={message} user={user} />)}
        </ul>
        <SendMessageForm />
      </div>
    )}
  </div>
}
