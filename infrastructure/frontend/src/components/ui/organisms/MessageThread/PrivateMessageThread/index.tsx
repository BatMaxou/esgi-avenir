import { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { MessageProvider } from "@/contexts/MessageContext";
import { GetHydratedPrivateChannelResponseInterface } from "../../../../../../../../application/services/api/resources/PrivateChannelResourceInterface";
import { WebsocketRessourceEnum } from "../../../../../../../../domain/enums/WebsocketRessourceEnum";

type Props = {
  children: ReactNode;
  channel: GetHydratedPrivateChannelResponseInterface;
};

export default function PrivateMessageLayout({ children, channel }: Props) {
  const t = useTranslations("components.organisms.messageThread");
  const channelId = channel.id;

  if (channelId === undefined) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <p className="text-lg">{t("channel_not_found")}</p>
        </div>
      </div>
    );
  }
  return (
    <MessageProvider
      ressource={WebsocketRessourceEnum.PRIVATE_MESSAGE}
      channelId={channelId}
    >
      {children}
    </MessageProvider>
  );
}
