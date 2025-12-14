'use client';

import { createContext, ReactNode, useEffect, useState } from "react"

import { toast } from "sonner";
import { useSseApiClient } from "./SseApiContext";
import { useAuth } from "./AuthContext";
import { Notification } from "../../../../domain/entities/Notification";

type Props = {
  children: ReactNode;
};

type NotifierContextType = {
  receivedNotification: Notification[];
};

export const NotifierContext = createContext<NotifierContextType>({
  receivedNotification: [],
});

export const NotifierProvider = ({ children }: Props) => {
  const [notificationReceived, setNotificationReceived] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { sseApiClient } = useSseApiClient();

  useEffect(() => {
    if (!user) {
      return;
    }

    sseApiClient.watchNotifications((notification => {
      toast.info(notification.content);

      setNotificationReceived(prev => [...prev, notification]);
    }));
  }, [sseApiClient, user]);

  return <NotifierContext.Provider value={{ receivedNotification: notificationReceived }}>
    {children}
  </NotifierContext.Provider>;
}
