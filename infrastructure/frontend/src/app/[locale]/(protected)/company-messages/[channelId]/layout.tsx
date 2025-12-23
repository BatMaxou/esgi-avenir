import { ReactNode } from "react";

import { MessageProvider } from "@/contexts/MessageContext";
import { WebsocketRessourceEnum } from "../../../../../../../../application/services/websocket/WebsocketRessourceEnum";

type Props = {
  children: ReactNode;
  params: Promise<{
    channelId: string;
  }>;
};

export default async function CompanyMessageLayout({ children, params }: Props) {
  const { channelId } = await params;

  return <MessageProvider ressource={WebsocketRessourceEnum.COMPANY_MESSAGE} channelId={parseInt(channelId)}>
    {children}
  </MessageProvider>
}
