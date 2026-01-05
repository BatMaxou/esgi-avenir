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
import { RoleEnum } from "../../../../../../../../domain/enums/RoleEnum";

export default function PrivateMessageThread({
  channelId,
}: {
  channelId: number;
}) {
  const [isChannelFetched, setIsChannelFetched] = useState<boolean>(false);
  const [staticMessages, setStaticMessages] = useState<Message[]>([]);
  const [isChannelPending, setIsChannelPending] = useState<boolean | undefined>(
    undefined
  );
  const { user } = useAuth();
  const { apiClient } = useApiClient();
  const { isAssignmentLoading, isChannelLoading } = useChannel();
  const { liveMessages, writingUsers } = useContext(MessageContext);
  const { getPrivateChannelById } = useChannel();
  const t = useTranslations("page.privateMessage");
  const ulRef = useRef<HTMLUListElement>(null);

  const scrollToBottom = useCallback(() => {
    if (ulRef.current) {
      ulRef.current.scrollTo(0, ulRef.current.scrollHeight);
    }
  }, [ulRef]);

  useEffect(() => {
    if (user && channelId && !isChannelLoading && (!isChannelFetched || isAssignmentLoading)) {
      getPrivateChannelById(channelId).then((response) => {
        if (!(response instanceof ApiClientError)) {
          setStaticMessages(response.messages?.reverse());
          setIsChannelPending(response.advisorId === undefined);
          setIsChannelFetched(true);
        }
      });
    }
  }, [apiClient, user, channelId, getPrivateChannelById, isAssignmentLoading, isChannelLoading, isChannelFetched]);

  useEffect(() => {
    scrollToBottom();
  }, [liveMessages, staticMessages, scrollToBottom]);

  return (
    <div className="h-full shadow-md bg-white rounded-lg">
      {staticMessages.length === 0 ? (
        <div className="flex justify-center items-center h-full p-4">
          <span>{t("no-results")}</span>
        </div>
      ) : (
        <div className="flex flex-col gap-6 h-full justify-between rounded-md shadow-sm pb-2">
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

          {isChannelPending
            ? <div className="px-2 text-center border-t p-2 pt-4">
              <span className="text-center text-gray-500">
                {user && user.roles?.includes(RoleEnum.ADVISOR)
                  ? t("advisor-pending")
                  : t("client-pending")}
              </span>
            </div>
            : <div className="px-2">
              {writingUsers.length > 0 && (
                <span className="text-sm text-gray-600">
                    {t('writing-users', { count: writingUsers.length, firstName: writingUsers[0].firstName, lastName: writingUsers[0].lastName })}
                </span>
              )}
              <SendMessageForm />
            </div>
          }
        </div>
      )}
    </div>
  );
}
