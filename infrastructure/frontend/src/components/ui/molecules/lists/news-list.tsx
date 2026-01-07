"use client";

import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { News } from "../../../../../../../domain/entities/News";
import { Skeleton } from "../../atoms/skeleton";
import { LoadingLink } from "../links/loading-link";

type NewsListProps = {
  news: News[];
  isLoading: boolean;
};

export function NewsList({ news, isLoading }: NewsListProps) {
  const t = useTranslations("page.news");

  const formatDate = (date: Date | undefined) => {
    if (!date) return t("noDate");
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-lg shadow-sm">
            <div className="flex items-start gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon
          icon="solar:document-text-linear"
          width={64}
          className="mx-auto mb-4 text-gray-400"
        />
        <p className="text-gray-500 text-lg">{t("no-results")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {news.map((newsItem) => (
        <LoadingLink key={newsItem.id} href={`/news/${newsItem.id}`}>
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-red-100 text-red-600">
                <Icon icon="emojione-monotone:newspaper" width={24} />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {newsItem.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{formatDate(newsItem.createdAt)}</span>
                  {newsItem.author && (
                    <>
                      <span>•</span>
                      <span>
                        {newsItem.author.firstName} {newsItem.author.lastName}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </LoadingLink>
      ))}
    </div>
  );
}
