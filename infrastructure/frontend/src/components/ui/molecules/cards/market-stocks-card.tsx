"use client";

import { useTranslations } from "next-intl";
import { LoaderCircleIcon } from "lucide-react";
import { FilledButton } from "../buttons/filled-button";
import { LoadingLink } from "../links/loading-link";
import { Icon } from "@iconify/react";
import { useStockOrders } from "@/contexts/StockOrdersContext";

export function StockMarketCard() {
  const t = useTranslations("components.cards.marketStocks");
  const { stockOrders, isStockOrdersLoading } = useStockOrders();

  if (isStockOrdersLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-[500px] flex flex-col">
        <h2 className="text-xl font-semibold mb-4">{t("title")}</h2>
        <div className="flex items-center justify-center flex-1">
          <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
        </div>
      </div>
    );
  }

  // if (stockOrders.length === 0) {
  //   return (
  //     <div className="bg-white rounded-lg shadow p-6 h-[500px] flex flex-col">
  //       <h2 className="text-xl font-semibold mb-4">{t("title")}</h2>
  //       <div className="flex items-center justify-center flex-1">
  //         <p className="text-gray-500 text-center">{t("noStocks")}</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{t("title")}</h2>
        <LoadingLink
          href="/investments/marketplace"
          className="flex items-center"
        >
          <p className="hover:underline inline-block text-end">
            {t("seeAll")}
            <Icon icon="mdi:arrow-right" className="inline-block ml-1" />
          </p>
        </LoadingLink>
      </div>{" "}
      <div className="flex items-center justify-center flex-1">
        <p className="text-gray-500 text-center">{t("availableSoon")}</p>{" "}
      </div>{" "}
    </div>
  );
}
