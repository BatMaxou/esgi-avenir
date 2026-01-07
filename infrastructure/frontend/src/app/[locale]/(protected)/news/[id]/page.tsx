"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { useAuth } from "@/contexts/AuthContext";
import { useApiClient } from "@/contexts/ApiContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { News } from "../../../../../../../../domain/entities/News";
import { ApiClientError } from "../../../../../../../../application/services/api/ApiClientError";
import { Skeleton } from "@/components/ui/atoms/skeleton";

export default function NewsDetailPage() {
  const [news, setNews] = useState<News | null>(null);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const { user, isLoading } = useAuth();
  const { apiClient } = useApiClient();
  const { endNavigation } = useNavigation();
  const params = useParams();
  const t = useTranslations("page.news.detail");

  const newsId = Number(params.id);

  useEffect(() => {
    endNavigation();
  }, []);

  useEffect(() => {
    if (user && newsId) {
      setIsLoadingNews(true);
      apiClient.news.get(newsId).then((response) => {
        if (response instanceof ApiClientError) {
          setNews(null);
        } else {
          setNews(response);
        }
        setIsLoadingNews(false);
      });
    }
  }, [apiClient, user, newsId]);

  if (!user && !isLoading) {
    notFound();
  }

  if (isLoadingNews) {
    return (
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{t("notFound")}</p>
      </div>
    );
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <article>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{news.title}</h1>
        <span>•</span>
        {news.createdAt && <span>{formatDate(news.createdAt)}</span>}
        {news.author && (
          <>
            <span>•</span>
            <span>
              {news.author.firstName} {news.author.lastName}
            </span>
          </>
        )}
      </div>

      <div
        className="prose prose-lg max-w-none"
        //! Attention, faille de sécu probable face au XSS sur dangerouslySetInnerHTML
        dangerouslySetInnerHTML={{ __html: news.content.value }}
      />
    </article>
  );
}
