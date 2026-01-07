"use client";

import { notFound } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { NotificationsTabs } from "@/components/ui/organisms/notifications-tabs";

export default function NotificationsPage() {
  const { user, isLoading } = useAuth();
  const { notifications, isNotificationsLoading, getNotifications } =
    useNotifications();
  const t = useTranslations("page.notifications");

  useEffect(() => {
    if (user) {
      getNotifications();
    }
  }, [user]);

  if (!user && !isLoading) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <NotificationsTabs
        notifications={notifications}
        isLoading={isNotificationsLoading}
      />
    </div>
  );
}
