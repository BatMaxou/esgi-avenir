"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useFinancialSecurities } from "@/contexts/FinancialSecuritiesContext";
import { useRouter } from "@/i18n/navigation";
import { useNavigation } from "@/contexts/NavigationContext";
import { ArrowLeftIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/atoms/button";
import { FinancialSecurity } from "../../../../../../../../../domain/entities/FinancialSecurity";
import { CompanyStockItem } from "@/components/ui/molecules/items/company-stock-item";
import { StockPurchaseItem } from "@/components/ui/molecules/items/stock-purchase-item";

export default function OwnedStocksPage() {
  const router = useRouter();
  const t = useTranslations("page.investments.owned");
  const tButton = useTranslations("buttons");
  const {
    financialSecurities,
    isFinancialSecuritiesLoading,
    getFinancialSecurities,
  } = useFinancialSecurities();
  const { endNavigation } = useNavigation();
  const [selectedStockId, setSelectedStockId] = useState<number | null>(null);

  useEffect(() => {
    getFinancialSecurities();
    endNavigation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groupedStocks = financialSecurities.reduce((acc, security) => {
    const stockName = security.stock?.name || t("unknownStock");
    const stockId = security.stock?.id;

    if (!stockId) return acc;

    if (!acc[stockId]) {
      acc[stockId] = {
        id: stockId,
        name: stockName,
        quantity: 0,
        totalValue: 0,
        averagePrice: 0,
        currentPrice: security.stock?.basePrice || 0,
        securities: [] as FinancialSecurity[],
      };
    }

    acc[stockId].quantity += 1;
    acc[stockId].totalValue += security.purchasePrice;
    acc[stockId].securities.push(security);

    return acc;
  }, {} as Record<number, { id: number; name: string; quantity: number; totalValue: number; averagePrice: number; currentPrice: number; securities: FinancialSecurity[] }>);

  Object.keys(groupedStocks).forEach((key) => {
    const stockId = Number(key);
    groupedStocks[stockId].averagePrice =
      groupedStocks[stockId].totalValue / groupedStocks[stockId].quantity;
  });

  const stocks = Object.values(groupedStocks).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  useEffect(() => {
    if (stocks.length > 0 && !selectedStockId) {
      setSelectedStockId(stocks[0].id);
    }
  }, [stocks, selectedStockId]);

  if (isFinancialSecuritiesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoaderCircleIcon className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (financialSecurities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-gray-500 text-lg">{t("noStocks")}</p>
        <Link href="/investments">
          <Button variant="outline">{t("backToInvestments")}</Button>
        </Link>
      </div>
    );
  }

  const selectedStock = stocks.find((s) => s.id === selectedStockId);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/investments")}
          className="cursor-pointer"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          {tButton("back")}
        </Button>
      </div>
      <div className="flex flex-1 gap-6 overflow-hidden">
        <div className="w-1/3 bg-white rounded-lg shadow flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-700">{t("companies")}</h2>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {stocks.map((stock) => (
              <CompanyStockItem
                key={stock.id}
                name={stock.name}
                quantity={stock.quantity}
                isSelected={selectedStockId === stock.id}
                onClick={() => setSelectedStockId(stock.id)}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow flex flex-col overflow-hidden">
          {selectedStock ? (
            <>
              <div className="p-6 border-b bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {selectedStock.name}
                    </h2>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      {selectedStock.totalValue}€
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {t("transactionHistory")}
                </h3>
                <div className="space-y-3">
                  {selectedStock.securities.map((security, index) => (
                    <StockPurchaseItem
                      key={index}
                      companyName={security.stock?.name || t("unknownStock")}
                      index={index}
                      purchasePrice={security.purchasePrice}
                      currentPrice={selectedStock.currentPrice}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              {t("selectCompanyDetails")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
