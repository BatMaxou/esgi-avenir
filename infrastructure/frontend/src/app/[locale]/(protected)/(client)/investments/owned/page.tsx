"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useFinancialSecurities } from "@/contexts/FinancialSecuritiesContext";
import { useRouter } from "@/i18n/navigation";
import { useNavigation } from "@/contexts/NavigationContext";
import { ArrowLeftIcon, LoaderCircleIcon, TrendingUpIcon } from "lucide-react";
import { Button } from "@/components/ui/atoms/button";
import { FinancialSecurity } from "../../../../../../../../../domain/entities/FinancialSecurity";
import { CompanyStockItem } from "@/components/ui/molecules/items/company-stock-item";
import { StockTransactionItem } from "@/components/ui/molecules/items/stock-transaction-item";
import { Icon } from "@iconify/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/atoms/tabs";
import { useStockOrders } from "@/contexts/StockOrdersContext";
import { StockOrderItem } from "@/components/ui/molecules/items/stock-order-item";
import { StockOrderStatusEnum } from "../../../../../../../../../domain/enums/StockOrderStatusEnum";
import { SellStockDialog } from "@/components/ui/molecules/dialogs/sell-stock-dialog";

export default function OwnedStocksPage() {
  const router = useRouter();
  const t = useTranslations("page.investments.owned");
  const tButton = useTranslations("buttons");
  const {
    financialSecurities,
    isFinancialSecuritiesLoading,
    getFinancialSecurities,
  } = useFinancialSecurities();
  const { stockOrders, getStockOrders, isStockOrdersLoading } = useStockOrders();
  const { endNavigation } = useNavigation();
  const [selectedStockId, setSelectedStockId] = useState<number | null>(null);
  const [isCompanyDeficit, setIsCompanyDeficit] = useState<boolean>(false);
  const [openSellDialog, setOpenSellDialog] = useState(false);

  useEffect(() => {
    getFinancialSecurities();
    getStockOrders();
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
        marketPrice: security.stock?.balance || 0,
        securities: [] as FinancialSecurity[],
      };
    }

    acc[stockId].quantity += 1;
    acc[stockId].securities.push(security);
    acc[stockId].totalValue += security.purchasePrice;

    return acc;
  }, {} as Record<number, { id: number; name: string; quantity: number; totalValue: number; marketPrice: number; securities: FinancialSecurity[] }>);

  stockOrders.forEach((order) => {
    const stockId = order.stock?.id;
    const stockName = order.stock?.name;

    if (!stockId || !stockName) return;

    if (!groupedStocks[stockId]) {
      groupedStocks[stockId] = {
        id: stockId,
        name: stockName,
        quantity: 0,
        totalValue: 0,
        marketPrice: 0,
        securities: [],
      };
    }
  });

  const stocks = Object.values(groupedStocks).sort((a, b) => {
    if (b.quantity !== a.quantity) {
      return b.quantity - a.quantity;
    }
    return a.name.localeCompare(b.name);
  });

  useEffect(() => {
    if (stocks.length > 0 && !selectedStockId) {
      setSelectedStockId(stocks[0].id);
    }
  }, [stocks, selectedStockId]);

  const selectedStock = stocks.find((s) => s.id === selectedStockId);

  useEffect(() => {
    if (!selectedStock) {
      return;
    }

    setIsCompanyDeficit(
      selectedStock.marketPrice * selectedStock.quantity <
        selectedStock.totalValue
    );
  }, [selectedStock]);

  const tabs = [
    {
      name: t("transactionHistory"),
      value: "history",
      content: (
        <div className="space-y-3 pe-2 pb-24">
          {stockOrders.filter((order) => order.stock?.id === selectedStockId)
            .length === 0 && (
            <p className="text-gray-500">{t("noStockOrders")}</p>
          )}
          {stockOrders
            .filter(
              (order) =>
                order.stock?.id === selectedStockId &&
                order.status === StockOrderStatusEnum.COMPLETED
            )
            .sort((a, b) => b.id - a.id)
            .map((stockOrder, index) => {
              return (
                <StockTransactionItem
                  key={index}
                  stockOrder={stockOrder}
                  index={index}
                />
              );
            })}
        </div>
      ),
    },
    {
      name: t("stockOrderRequest"),
      value: "requests",
      content: (
        <div className="space-y-3 pe-2 pb-24">
          {stockOrders.filter((order) => order.stock?.id === selectedStockId)
            .length === 0 && (
            <p className="text-gray-500">{t("noStockOrders")}</p>
          )}
          {stockOrders
            .filter((order) => order.stock?.id === selectedStockId)
            .sort((a, b) => b.id - a.id)
            .map((stockOrder, index) => {
              return (
                <StockOrderItem
                  key={index}
                  id={stockOrder.id || 0}
                  status={stockOrder.status}
                  type={stockOrder.type}
                  amount={stockOrder.amount}
                  purchasedPrice={stockOrder.purchasePrice}
                  stock={stockOrder.stock || { id: 0, name: "" }}
                />
              );
            })}
        </div>
      ),
    },
  ];

  const handleReloadStockOrders = () => {
    getStockOrders();
  };

  if (isFinancialSecuritiesLoading || isStockOrdersLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoaderCircleIcon className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-gray-500 text-lg">{t("noStocks")}</p>
        <Link href="/investments">
          <Button variant="outline">{t("backToInvestments")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/investments")}
          className="cursor-pointer"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          {tButton("back")}
        </Button>
        <SellStockDialog
          open={openSellDialog}
          setOpen={setOpenSellDialog}
          stocks={stocks}
          onUpdate={handleReloadStockOrders}
        />
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
                  <div className="flex flex-col items-start justify-start">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {selectedStock.name}
                    </h2>
                    <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                      {selectedStock.quantity} {t("stocks")}
                    </span>
                  </div>
                  <div className="text-right flex flex-col items-end justify-start">
                    <div className="text-gray-900 mb-1">
                      <span className="text-md">{t("purchaseValue")} :</span>{" "}
                      <span className="text-xl font-semibold">
                        {selectedStock.totalValue}€
                      </span>
                    </div>
                    <div className="text-md text-gray-600">
                      {t("currentMarketValue")} :{" "}
                      {selectedStock.marketPrice * selectedStock.quantity !== selectedStock.totalValue && (
                        <>
                        {isCompanyDeficit ? (
                          <Icon
                          icon="mdi:trending-down"
                          className="inline-block mr-1 text-red-600"
                          />
                        ) : (
                          <TrendingUpIcon className="inline-block mr-1 text-green-600" />
                        )}
                        </>
                      )}
                      <span
                        className={`${
                          selectedStock.marketPrice * selectedStock.quantity !== selectedStock.totalValue ? isCompanyDeficit ? "text-red-600" : "text-green-600" : "text-gray-600"
                        } font-semibold`}
                      >
                        {(
                          selectedStock.marketPrice * selectedStock.quantity
                        ).toFixed(2)}
                        €
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="history" className="gap-4 h-full w-full">
                <TabsList className="bg-background rounded-none border-b p-0 w-full">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none cursor-pointer"
                    >
                      {tab.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="flex-1 overflow-y-auto p-6">
                  {tabs.map((tab) => (
                    <TabsContent
                      value={tab.value}
                      className="h-full"
                      key={tab.value}
                    >
                      <div className="text-muted-foreground text-sm h-full overflow-y-auto">
                        {tab.content}
                      </div>
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
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
