"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { useSseApiClient } from "./SseApiContext";
import { useAuth } from "./AuthContext";
import { useApiClient } from "./ApiContext";
import { News } from "../../../../domain/entities/News";
import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { CreateNewsPayloadInterface } from "../../../../application/services/api/resources/NewsResourceInterface";
import { showErrorToast } from "@/lib/toast";

type Props = {
  children: ReactNode;
};

type NewsContextType = {
  receivedNews: News[];
  createNews: (data: CreateNewsPayloadInterface) => Promise<void>;
};

export const NewsContext = createContext<NewsContextType>({
  receivedNews: [],
  createNews: async () => {},
});

export const NewsProvider = ({ children }: Props) => {
  const [newsReceived, setNewsReceived] = useState<News[]>([]);
  const { user } = useAuth();
  const { sseApiClient } = useSseApiClient();
  const { apiClient } = useApiClient();

  useEffect(() => {
    if (!user) {
      return;
    }

    sseApiClient.watchNews((news) => {
      setNewsReceived((prev) => [...prev, news]);
    });
  }, [sseApiClient, user]);

  const createNews = async (
    data: CreateNewsPayloadInterface
  ): Promise<void> => {
    const response = await apiClient.news.create(data);

    if (response instanceof ApiClientError) {
      showErrorToast(response.message);
      console.error("Failed to create news:", response.message);
      return;
    }

    setNewsReceived((prev) => [response, ...prev]);
    return;
  };

  return (
    <NewsContext.Provider value={{ receivedNews: newsReceived, createNews }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error("useNews must be used within a NewsProvider");
  }
  return context;
};
