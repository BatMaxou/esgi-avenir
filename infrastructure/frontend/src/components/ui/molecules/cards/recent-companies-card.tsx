"use client";

import { useEffect } from "react";
import { useStocks } from "@/contexts/StocksContext";
import { useTranslations } from "next-intl";
import { LoaderCircleIcon, Building2 } from "lucide-react";
import { LoadingLink } from "../links/loading-link";
import { Icon } from "@iconify/react";

export function RecentCompaniesCard() {
  const t = useTranslations("components.cards.recentCompanies");
  const { stocks, isStocksLoading, getStocks } = useStocks();

  useEffect(() => {
    getStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recentCompanies = stocks
    .sort((a, b) => (b.remainingQuantity || 0) - (a.remainingQuantity || 0))
    .map((stock) => stock);

  if (isStocksLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-[400px] flex flex-col">
        <h2 className="text-xl font-semibold mb-4">{t("title")}</h2>
        <div className="flex items-center justify-center flex-1">
          <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
        </div>
      </div>
    );
  }

  if (recentCompanies.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-[400px] flex flex-col">
        <h2 className="text-xl font-semibold mb-4">{t("title")}</h2>
        <div className="flex items-center justify-center flex-1">
          <p className="text-gray-500 text-center">{t("noCompanies")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{t("title")}</h2>
        <LoadingLink href="/investments/stocks" className="flex items-center">
          <p className="hover:underline inline-block text-end">
            {t("seeAll")}
            <Icon icon="mdi:arrow-right" className="inline-block ml-1" />
          </p>
        </LoadingLink>
      </div>
      <div className="flex-1 overflow-auto space-y-3">
        {recentCompanies.map((stock, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{stock.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
