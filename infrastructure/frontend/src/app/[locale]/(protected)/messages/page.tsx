"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { CompanyChannel } from "../../../../../../../domain/entities/CompanyChannel";
import { RoleEnum } from "../../../../../../../domain/enums/RoleEnum";
import { GetHydratedPrivateChannelResponseInterface } from "../../../../../../../application/services/api/resources/PrivateChannelResourceInterface";
import { useNavigation } from "@/contexts/NavigationContext";
import { useChannel } from "@/contexts/ChannelContext";
import { MessageThread } from "@/components/ui/organisms/MessageThread";
import CreateCompanyChannelDialog from "@/components/ui/molecules/dialogs/create-company-channel-dialog";
import { FilledButton } from "@/components/ui/molecules/buttons/filled-button";
import { showErrorToast } from "@/lib/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/atoms/tooltip";

type ChannelWithType = {
  channel: GetHydratedPrivateChannelResponseInterface | CompanyChannel;
  type: "private" | "company";
  isPending?: boolean;
};

type TabType = "all" | "private" | "company" | "pending";

export default function MessagesPage() {
  const t = useTranslations("page.messages");
  const { user } = useAuth();
  const { endNavigation } = useNavigation();
  const {
    isChannelsLoading,
    isChannelLoading,
    isAssignmentLoading,
    companyChannels,
    privateChannels,
    allChannels,
    getAllCompanyChannels,
    getAllPrivateChannels,
    getAllChannels,
    assignAdvisorToChannel,
  } = useChannel();

  const [channels, setChannels] = useState<ChannelWithType[]>([]);
  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (user?.roles?.includes(RoleEnum.ADVISOR)) return "all";
    if (user?.roles?.includes(RoleEnum.DIRECTOR)) return "company";
    return "private";
  });
  const [selectedChannel, setSelectedChannel] =
    useState<ChannelWithType | null>(null);
  const [selectedChannelIndex, setSelectedChannelIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    endNavigation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchChannels = async () => {
    if (!user) return;

    if (user.roles?.includes(RoleEnum.ADVISOR)) {
      await getAllChannels();
    } else if (user.roles?.includes(RoleEnum.DIRECTOR)) {
      await getAllCompanyChannels();
    } else {
      await getAllPrivateChannels();
    }
    setIsFetched(true);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    if (!isFetched || isChannelsLoading || isChannelLoading) return;

    if (user.roles?.includes(RoleEnum.ADVISOR)) {
      setChannels(allChannels);
    } else if (user.roles?.includes(RoleEnum.DIRECTOR)) {
      setChannels(
        companyChannels.map((channel) => ({
          channel: channel.channel,
          type: "company" as const,
        }))
      );
    } else {
      setChannels(
        privateChannels.map((channel) => ({
          channel: channel.channel,
          type: "private" as const,
          isPending: channel.isPending,
        }))
      );
    }
  }, [
    allChannels,
    companyChannels,
    privateChannels,
    user,
    isFetched,
    isChannelsLoading,
    isChannelLoading,
  ]);

  const filteredChannels = channels
    .filter((channel) => {
      if (activeTab === "all") return true;
      if (activeTab === "pending") return channel.isPending === true;
      return channel.type === activeTab;
    })
    .sort((a, b) => (b?.channel?.id ?? 0) - (a?.channel?.id ?? 0));

  const tabs: { key: TabType; label: string; show: boolean }[] = [
    { key: "all", label: t("tabs.all"), show: true },
    {
      key: "private",
      label: t("tabs.private"),
      show:
        user?.roles?.includes(RoleEnum.USER) ||
        user?.roles?.includes(RoleEnum.ADVISOR) ||
        false,
    },
    {
      key: "company",
      label: t("tabs.company"),
      show:
        user?.roles?.includes(RoleEnum.DIRECTOR) ||
        user?.roles?.includes(RoleEnum.ADVISOR) ||
        false,
    },
    {
      key: "pending",
      label: t("tabs.pending"),
      show: user?.roles?.includes(RoleEnum.ADVISOR) || false,
    },
  ];

  const isAdvisor = user?.roles?.includes(RoleEnum.ADVISOR) || false;

  const handleAssignAdvisorToChannel = async (
    channelId: number | undefined
  ) => {
    if (!channelId) {
      showErrorToast(t("channelNotFound"));
      return;
    }

    await assignAdvisorToChannel(channelId);
    await fetchChannels();
    setSelectedChannel((prev) => (prev ? { ...prev, isPending: false } : null));
    return;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {isAdvisor && (
          <div className="flex border-b border-gray-200 bg-gray-50">
            {tabs
              .filter((tab) => tab.show)
              .map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "text-black border-b-2 border-black bg-white"
                      : "text-gray-600 hover:text-black hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
          </div>
        )}

        {user && user.roles?.includes(RoleEnum.DIRECTOR) && (
          <CreateCompanyChannelDialog />
        )}

        <div className="flex-1 overflow-y-auto">
          {filteredChannels.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {t("no_channels")}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 ">
              {filteredChannels.map((channelWithType, index) => (
                <button
                  key={`${channelWithType.type}-${channelWithType.channel.id}`}
                  onClick={() => {
                    setSelectedChannel(channelWithType);
                    setSelectedChannelIndex(index);
                  }}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedChannelIndex === index
                      ? "bg-light-orange border-l-4 border-secondary-red hover:bg-dark-orange"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-black truncate">
                        {channelWithType.channel.title}
                      </h3>
                      {activeTab === "all" && (
                        <div className="flex items-center gap-2 mt-1">
                          {channelWithType.isPending && (
                            <span className="px-2 py-0.5 bg-white text-primary-red border-primary-red border text-xs rounded-full">
                              {t("pending")}
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              channelWithType.type === "private"
                                ? "bg-light-orange text-white"
                                : "bg-primary-red text-white"
                            }`}
                          >
                            {channelWithType.type === "private"
                              ? t("private")
                              : t("company")}
                          </span>
                        </div>
                      )}
                      {activeTab === "private" && (
                        <div className="flex items-center gap-2 mt-1">
                          {channelWithType.isPending && (
                            <span className="px-2 py-0.5 bg-white text-primary-red border-primary-red border text-xs rounded-full">
                              {t("pending")}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {!selectedChannel ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg">{t("select_conversation")}</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-between justify-between h-full">
            <div className="flex flex-row justify-between items-center p-4 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-semibold text-black">
                {selectedChannel.channel.title}
              </h2>
              {selectedChannel.isPending &&
                user?.roles.includes(RoleEnum.ADVISOR) && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FilledButton
                        icon="icon-park-outline:tickets-checked"
                        iconSize={48}
                        disabled={isAssignmentLoading}
                        loading={isAssignmentLoading}
                        onClick={() => {
                          handleAssignAdvisorToChannel(
                            selectedChannel.channel.id
                          );
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("assign_to_me")}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
            </div>
            <div className="flex-1 p-1 overflow-y-auto">
              <MessageThread
                key={`${selectedChannel.type}-${selectedChannel.channel.id}`}
                channel={selectedChannel.channel}
                channelType={selectedChannel.type}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
