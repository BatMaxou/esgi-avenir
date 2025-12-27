"use client";

import { useEffect } from "react";
import { useFinancialSecurities } from "@/contexts/FinancialSecuritiesContext";
import { useTranslations } from "next-intl";
import { LoaderCircleIcon } from "lucide-react";
import { UserStocksDataTable } from "../../organisms/UserStocksDataTable/UserStocksDataTable";
import { LoadingLink } from "../links/loading-link";
import { Icon } from "@iconify/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../atoms/tooltip";

export function UserStocksCard() {
  const t = useTranslations("components.cards.userStocks");
  const {
    financialSecurities,
    isFinancialSecuritiesLoading,
    getFinancialSecurities,
  } = useFinancialSecurities();

  useEffect(() => {
    getFinancialSecurities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groupedStocks = financialSecurities.reduce((acc, security) => {
    const stockName = security.stock?.name || t("unknownStock");
    const stockId = security.stock?.id;

    if (!stockId) return acc;

    if (!acc[stockId]) {
      acc[stockId] = {
        name: stockName,
        quantity: 0,
        totalValue: 0,
        marketPrice: security.stock?.balance || 0,
      };
    }

    acc[stockId].quantity += 1;
    acc[stockId].totalValue += security.purchasePrice;

    return acc;
  }, {} as Record<number, { name: string; quantity: number; totalValue: number; marketPrice: number }>);

  const stocks = Object.values(groupedStocks);
  if (isFinancialSecuritiesLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-[500px] flex flex-col">
        <h2 className="text-xl font-semibold mb-4">{t("title")}</h2>
        <div className="flex items-center justify-center flex-1">
          <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
        </div>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-[500px] flex flex-col">
        <h2 className="text-xl font-semibold mb-4">{t("title")}</h2>
        <div className="flex items-center justify-center flex-1">
          <p className="text-gray-500 text-center">{t("noStocks")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{t("title")}</h2>
        <LoadingLink href="/investments/owned" className="flex items-center">
          <p className="hover:underline inline-block text-end">
            {t("seeAll")}
            <Icon icon="mdi:arrow-right" className="inline-block ml-1" />
          </p>
        </LoadingLink>
      </div>
      <div className="flex-1 overflow-auto">
        <UserStocksDataTable
          data={stocks.slice(0, 5)}
          isLoading={isFinancialSecuritiesLoading}
        />
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            {t("totalPortfolio")}
          </span>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {stocks
                .reduce(
                  (sum, stock) => sum + stock.marketPrice * stock.quantity,
                  0
                )
                .toFixed(2)}{" "}
              €{" "}
              <Tooltip>
                <TooltipTrigger>
                  (
                  {stocks
                    .reduce(
                      (sum, stock) => sum + stock.marketPrice * stock.quantity,
                      0
                    )
                    .toFixed(2)}{" "}
                  € )
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("currentMarketValue")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
