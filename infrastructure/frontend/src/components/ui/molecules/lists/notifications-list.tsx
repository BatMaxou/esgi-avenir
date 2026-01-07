"use client";

import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { Notification } from "../../../../../../../domain/entities/Notification";

type NotificationsListProps = {
  notifications: Notification[];
  isLoading: boolean;
};

export function NotificationsList({
  notifications,
  isLoading,
}: NotificationsListProps) {
  const t = useTranslations("page.notifications");

  const formatDate = (date: Date | undefined) => {
    if (!date) return t("noDate");
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 border rounded-lg shadow-sm animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon
          icon="solar:bell-off-linear"
          width={64}
          className="mx-auto mb-4 text-gray-400"
        />
        <p className="text-gray-500 text-lg">{t("noResults")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-y-scroll h-full">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                notification.type === "global"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              <Icon
                icon={
                  notification.type === "global"
                    ? "entypo:megaphone"
                    : "iconamoon:notification-light"
                }
                width={24}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    notification.type === "global"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {t(`type.${notification.type}`)}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(notification.createdAt)}
                </span>
              </div>
              <p className="text-gray-800">{notification.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
