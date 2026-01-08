"use client";

import { notFound } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { useAuth } from "@/contexts/AuthContext";
import { NewsContext } from "@/contexts/NewsContext";
import { useApiClient } from "@/contexts/ApiContext";
import { News } from "../../../../../../../domain/entities/News";
import { ApiClientError } from "../../../../../../../application/services/api/ApiClientError";
import { useNavigation } from "@/contexts/NavigationContext";
import { RoleEnum } from "../../../../../../../domain/enums/RoleEnum";
import { LoadingLink } from "@/components/ui/molecules/links/loading-link";
import { FilledButton } from "@/components/ui/molecules/buttons/filled-button";
import { NewsList } from "@/components/ui/molecules/lists/news-list";

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const { user, isLoading } = useAuth();
  const { apiClient } = useApiClient();
  const { receivedNews } = useContext(NewsContext);
  const t = useTranslations("page.news");
  const { endNavigation } = useNavigation();

  useEffect(() => {
    endNavigation();
  }, []);

  useEffect(() => {
    if (user) {
      setIsLoadingNews(true);
      apiClient.news.getAll().then((response) => {
        if (!(response instanceof ApiClientError)) {
          setNews(response);
        }
        setIsLoadingNews(false);
      });
    }
  }, [apiClient, user]);

  useEffect(() => {
    const lastNews = receivedNews.length > 0 ? receivedNews.pop() : null;
    if (!lastNews) {
      return;
    }

    setNews((prev) => [lastNews, ...prev]);
  }, [receivedNews]);

  if (!user && !isLoading) {
    notFound();
  }

  const isAdvisor = user?.roles.includes(RoleEnum.ADVISOR);

  return (
    <div>
      {isAdvisor && (
        <div className="mb-6">
          <LoadingLink href="/news/create">
            <FilledButton label={t("addNews")} />
          </LoadingLink>
        </div>
      )}

      <NewsList news={news} isLoading={isLoadingNews} />
    </div>
  );
}
