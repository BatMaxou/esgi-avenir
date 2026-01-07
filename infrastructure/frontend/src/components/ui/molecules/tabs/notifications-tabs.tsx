"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import { Notification } from "../../../../../../../domain/entities/Notification";
import { NotificationsList } from "../lists/notifications-list";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../atoms/tabs";

type TabType = "all" | "global" | "private";

type NotificationsTabsProps = {
  notifications: Notification[];
  isLoading: boolean;
};

export function NotificationsTabs({
  notifications,
  isLoading,
}: NotificationsTabsProps) {
  const t = useTranslations("page.notifications");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);

  useEffect(() => {
    let filtered = [...notifications];

    if (activeTab === "global") {
      filtered = filtered.filter((n) => n.type === "global");
    } else if (activeTab === "private") {
      filtered = filtered.filter((n) => n.type === "private");
    }

    filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    setFilteredNotifications(filtered);
  }, [notifications, activeTab]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as TabType)}
      className="h-full overflow-hidden"
    >
      <TabsList className="w-full bg-transparent border-b border-gray-200 rounded-none p-0 h-auto mb-6">
        <TabsTrigger
          value="all"
          className="flex-1 px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-red data-[state=active]:text-primary-red data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <Icon icon="solar:list-bold" width={20} />
          {t("filters.all")}
        </TabsTrigger>
        <TabsTrigger
          value="global"
          className="flex-1 px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-red data-[state=active]:text-primary-red data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <Icon icon="entypo:megaphone" width={20} />
          {t("filters.global")}
        </TabsTrigger>
        <TabsTrigger
          value="private"
          className="flex-1 px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-red data-[state=active]:text-primary-red data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          <Icon icon="iconamoon:notification-light" width={20} />
          {t("filters.private")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="h-full pb-20">
        <NotificationsList
          notifications={filteredNotifications}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="global" className="h-full pb-20">
        <NotificationsList
          notifications={filteredNotifications}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="private" className="h-full pb-20">
        <NotificationsList
          notifications={filteredNotifications}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
}
