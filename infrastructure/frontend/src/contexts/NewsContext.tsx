'use client';

import { createContext, ReactNode, useEffect, useState } from "react"

import { useSseApiClient } from "./SseApiContext";
import { useAuth } from "./AuthContext";
import { News } from "../../../../domain/entities/News";

type Props = {
  children: ReactNode;
};

type NewsContextType = {
  receivedNews: News[];
};

export const NewsContext = createContext<NewsContextType>({
  receivedNews: [],
});

export const NewsProvider = ({ children }: Props) => {
  const [newsReceived, setNewsReceived] = useState<News[]>([]);
  const { user } = useAuth();
  const { sseApiClient } = useSseApiClient();

  useEffect(() => {
    if (!user) {
      return;
    }

    sseApiClient.watchNews((news => {
      setNewsReceived(prev => [...prev, news]);
    }));
  }, [sseApiClient, user]);

  return <NewsContext.Provider value={{ receivedNews: newsReceived }}>
    {children}
  </NewsContext.Provider>;
}
