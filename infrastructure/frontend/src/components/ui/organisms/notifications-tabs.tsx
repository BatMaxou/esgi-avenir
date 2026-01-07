"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import { Notification } from "../../../../../../domain/entities/Notification";
import { NotificationsList } from "./lists/notifications-list";

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
    <div>
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === "all"
              ? "text-primary-red border-b-2 border-primary-red"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Icon icon="solar:list-bold" width={20} />
          {t("filters.all")}
        </button>
        <button
          onClick={() => setActiveTab("global")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === "global"
              ? "text-primary-red border-b-2 border-primary-red"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Icon icon="entypo:megaphone" width={20} />
          {t("filters.global")}
        </button>
        <button
          onClick={() => setActiveTab("private")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === "private"
              ? "text-primary-red border-b-2 border-primary-red"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Icon icon="iconamoon:notification-light" width={20} />
          {t("filters.private")}
        </button>
      </div>

      <NotificationsList
        notifications={filteredNotifications}
        isLoading={isLoading}
      />
    </div>
  );
}
