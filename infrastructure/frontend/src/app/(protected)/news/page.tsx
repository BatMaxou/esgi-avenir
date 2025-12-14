'use client';

import { notFound } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { NewsContext } from "@/contexts/NewsContext";
import { useApiClient } from "@/contexts/ApiContext";
import { News } from "../../../../../../domain/entities/News";
import { ApiClientError } from "../../../../../../application/services/api/ApiClientError";

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const { user, isLoading } = useAuth();
  const { apiClient } = useApiClient();
  const { receivedNews } = useContext(NewsContext);

  useEffect(() => {
    if (user) {
      apiClient.news.getAll().then((response) => {
        if (!(response instanceof ApiClientError)) {
          setNews(response);
        }
      });
    }
  }, [apiClient, user]);

  useEffect(() => {
    setNews(prev => [...prev, ...receivedNews]);
  }, [receivedNews]);

  if (!user && !isLoading) {
    notFound();
  }

  console.log("News rendered with items:", news);

  return <div>
    <h1 className="text-2xl font-bold mb-4">News</h1>
    {news.length === 0 ? (
      <p>No news available.</p>
    ) : (
      <ul className="space-y-4">
        {news.map((newsItem) => (
          <li key={newsItem.id} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">{newsItem.title}</h2>
            <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: newsItem.content.value }}></p>
            {newsItem.createdAt && <span className="text-sm text-gray-400">{new Date(newsItem.createdAt).toLocaleString()}</span>}
          </li>
        ))}
      </ul>
    )}
  </div>
}
