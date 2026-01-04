"use client";

import { useTranslations } from "next-intl";
import { CompanyChannel } from "../../../../../../../domain/entities/CompanyChannel";
import { GetHydratedPrivateChannelResponseInterface } from "../../../../../../../application/services/api/resources/PrivateChannelResourceInterface";
import PrivateMessageLayout from "./PrivateMessageThread";
import PrivateMessageThread from "./PrivateMessageThread/private-message-thread";
import CompanyMessageLayout from "./CompanyMessageThread";
import CompanyMessageThread from "./CompanyMessageThread/company-message-thread";

type MessageThreadProps = {
  channel: GetHydratedPrivateChannelResponseInterface | CompanyChannel;
  channelType: "private" | "company";
};

export function MessageThread({ channel, channelType }: MessageThreadProps) {
  const t = useTranslations("components.organisms.messageThread");

  if (!channel.id) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <p className="text-lg">{t("channel_not_found")}</p>
        </div>
      </div>
    );
  }

  if (channelType === "private") {
    return (
      <PrivateMessageLayout
        channel={channel as GetHydratedPrivateChannelResponseInterface}
      >
        <PrivateMessageThread channelId={channel.id} />
      </PrivateMessageLayout>
    );
  } else if (channelType === "company") {
    return (
      <CompanyMessageLayout channel={channel as CompanyChannel}>
        <CompanyMessageThread channelId={channel.id} />
      </CompanyMessageLayout>
    );
  }
}
