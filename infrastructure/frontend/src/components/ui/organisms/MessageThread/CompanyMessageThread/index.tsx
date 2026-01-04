import { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { MessageProvider } from "@/contexts/MessageContext";
import { WebsocketRessourceEnum } from "../../../../../../../../application/services/websocket/WebsocketRessourceEnum";
import { CompanyChannel } from "../../../../../../../../domain/entities/CompanyChannel";

type Props = {
  children: ReactNode;
  channel: CompanyChannel;
};

export default function CompanyMessageLayout({ children, channel }: Props) {
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
      ressource={WebsocketRessourceEnum.COMPANY_MESSAGE}
      channelId={channelId}
    >
      {children}
    </MessageProvider>
  );
}
