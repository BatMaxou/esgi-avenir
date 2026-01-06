"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useTranslations } from "next-intl";
import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { useApiClient } from "./ApiContext";
import { getCookie } from "../../../utils/frontend/cookies";
import { GetNotificationResponseInterface } from "../../../../application/services/api/resources/NotificationResourceInterface";
import { Notification } from "../../../../domain/entities/Notification";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useAuth } from "./AuthContext";

type Props = {
  children: ReactNode;
};

type NotificationsContextType = {
  notifications: Notification[];
  isNotificationsLoading: boolean;
  getNotifications: () => Promise<void>;
  createGlobalNotification: (
    content: string
  ) => Promise<GetNotificationResponseInterface | null>;
  createPrivateNotification: (
    content: string,
    userId: number
  ) => Promise<GetNotificationResponseInterface | null>;
};

export const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const NotificationsProvider = ({ children }: Props) => {
  const t = useTranslations("contexts.notifications");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsLoading, setIsNotificationsLoading] =
    useState<boolean>(false);
  const { apiClient } = useApiClient();
  const { user } = useAuth();

  const getNotifications = async () => {
    setIsNotificationsLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsNotificationsLoading(false);
      return;
    }

    const response = await apiClient.notification.getAll();

    if (response instanceof ApiClientError) {
      console.error("Failed to fetch notifications:", response.message);
      setNotifications([]);
    } else {
      const notificationList = response
        .map((notificationData) =>
          Notification.from({
            id: notificationData.id,
            content: notificationData.content,
            advisorId: notificationData.advisorId || user?.id || 0,
            userId: notificationData.userId,
            createdAt: notificationData.createdAt,
          })
        )
        .filter((n): n is Notification => !(n instanceof Error));

      setNotifications(notificationList);
    }

    setIsNotificationsLoading(false);
  };

  const createGlobalNotification = async (
    content: string
  ): Promise<GetNotificationResponseInterface | null> => {
    setIsNotificationsLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsNotificationsLoading(false);
      showErrorToast(t("mustBeConnectedToCreate"));
      return null;
    }

    const response = await apiClient.notification.create({ content });

    if (response instanceof ApiClientError) {
      console.error("Failed to create notification:", response.message);
      showErrorToast(t("errorCreating"));
      setIsNotificationsLoading(false);
      return null;
    }

    showSuccessToast(t("notificationCreated"));
    await getNotifications();
    setIsNotificationsLoading(false);
    return response;
  };

  const createPrivateNotification = async (
    content: string,
    userId: number
  ): Promise<GetNotificationResponseInterface | null> => {
    setIsNotificationsLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsNotificationsLoading(false);
      showErrorToast(t("mustBeConnectedToCreate"));
      return null;
    }

    const response = await apiClient.notification.create({ content, userId });

    if (response instanceof ApiClientError) {
      console.error("Failed to create notification:", response.message);
      showErrorToast(t("errorCreating"));
      setIsNotificationsLoading(false);
      return null;
    }

    showSuccessToast(t("notificationCreated"));
    await getNotifications();
    setIsNotificationsLoading(false);
    return response;
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        isNotificationsLoading,
        getNotifications,
        createGlobalNotification,
        createPrivateNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};
