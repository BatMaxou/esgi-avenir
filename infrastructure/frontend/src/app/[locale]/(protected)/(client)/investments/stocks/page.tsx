"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useFinancialSecurities } from "@/contexts/FinancialSecuritiesContext";
import { useRouter } from "@/i18n/navigation";
import { useNavigation } from "@/contexts/NavigationContext";
import { ArrowLeftIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/atoms/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/atoms/tabs";
import { FinancialSecurity } from "../../../../../../../../../domain/entities/FinancialSecurity";
import { CompanyStockItem } from "@/components/ui/molecules/items/company-stock-item";
import { StockOrderItem } from "@/components/ui/molecules/items/stock-order-item";
import { useStockOrders } from "@/contexts/StockOrdersContext";
import { useStocks } from "@/contexts/StocksContext";
import { SellStockDialog } from "@/components/ui/molecules/dialogs/sell-stock-dialog";
import { BuyStockDialog } from "@/components/ui/molecules/dialogs/buy-stock-dialog";
import { BuyStockOrderDialog } from "@/components/ui/molecules/dialogs/buy-stock-order-dialog";

export default function StocksPage() {
  const router = useRouter();
  const t = useTranslations("page.investments.stocks");
  const tButton = useTranslations("buttons");
  const {
    financialSecurities,
    isFinancialSecuritiesLoading,
    getFinancialSecurities,
  } = useFinancialSecurities();
  const { stockOrders, getStockOrders, isStockOrdersLoading } =
    useStockOrders();
  const { stocks, getStocks } = useStocks();
  const { endNavigation } = useNavigation();
  const [selectedStockId, setSelectedStockId] = useState<number | null>(null);
  const [openSellDialog, setOpenSellDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [orderFilter, setOrderFilter] = useState<"all" | "buy" | "sell">("all");

  useEffect(() => {
    getFinancialSecurities();
    getStockOrders();
    getStocks();
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
        basePrice: security.stock?.basePrice || 0,
        securities: [] as FinancialSecurity[],
      };
    }

    acc[stockId].quantity += 1;
    acc[stockId].securities.push(security);
    acc[stockId].totalValue += security.purchasePrice;

    return acc;
  }, {} as Record<number, { id: number; name: string; quantity: number; totalValue: number; marketPrice: number; basePrice: number; securities: FinancialSecurity[] }>);

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
        basePrice: 0,
        securities: [],
      };
    }
  });

  useEffect(() => {
    if (stocks.length > 0 && !selectedStockId) {
      setSelectedStockId(stocks[0].id as number);
    }
  }, [stocks, selectedStockId]);

  const enrichedStocks = stocks.map((stock) => ({
    ...stock,
    securities: financialSecurities.filter((sec) => sec.stock?.id === stock.id),
  }));

  if (isFinancialSecuritiesLoading || isStockOrdersLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoaderCircleIcon className="mr-2 h-8 w-8 animate-spin" />
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
                isSelected={selectedStockId === stock.id}
                onClick={() => setSelectedStockId(stock.id as number)}
              />
            ))}
          </div>
        </div>
        <div className="w-2/3 bg-white rounded-lg shadow flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex items-center justify-between">
                <TabsList className="bg-gray-50">
                  <TabsTrigger
                    value="details"
                    className="font-semibold! text-md text-gray-700! hover:bg-gray-100 data-[state=active]:bg-gray-50! data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none cursor-pointer"
                  >
                    {t("details")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="orders"
                    className="font-semibold! text-md text-gray-700! hover:bg-gray-100 data-[state=active]:bg-gray-50! data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none cursor-pointer"
                  >
                    {t("stockOrders")}
                  </TabsTrigger>
                </TabsList>
                {activeTab === "orders" &&
                  selectedStockId &&
                  (() => {
                    const filteredOrders = stockOrders
                      .filter((order) => order.stock?.id === selectedStockId)
                      .filter((order) => order.status !== "completed");

                    const allCount = filteredOrders.length;
                    const buyCount = filteredOrders.filter(
                      (order) => order.type === "buy"
                    ).length;
                    const sellCount = filteredOrders.filter(
                      (order) => order.type === "sell"
                    ).length;

                    return (
                      <div className="flex gap-0 bg-gray-50 p-[3px] rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setOrderFilter("all")}
                          className={`font-semibold text-sm rounded-none border-0 border-b-2 cursor-pointer ${
                            orderFilter === "all"
                              ? "text-gray-700 bg-gray-50 border-primary"
                              : "text-gray-700 border-transparent hover:bg-gray-100"
                          }`}
                        >
                          {t("all")} {allCount > 0 && `(${allCount})`}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setOrderFilter("buy")}
                          className={`font-semibold text-sm rounded-none border-0 border-b-2 cursor-pointer ${
                            orderFilter === "buy"
                              ? "text-gray-700 bg-gray-50 border-primary shadow-sm"
                              : "text-gray-700 border-transparent hover:bg-gray-100"
                          }`}
                        >
                          {t("buy")} {buyCount > 0 && `(${buyCount})`}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setOrderFilter("sell")}
                          className={`font-semibold text-sm rounded-none border-0 border-b-2 cursor-pointer ${
                            orderFilter === "sell"
                              ? "text-gray-700 bg-gray-50 border-primary shadow-sm"
                              : "text-gray-700 border-transparent hover:bg-gray-100"
                          }`}
                        >
                          {t("sell")} {sellCount > 0 && `(${sellCount})`}
                        </Button>
                      </div>
                    );
                  })()}
              </div>
            </Tabs>
          </div>
          <div className="overflow-y-auto flex-1 p-4">
            {selectedStockId &&
              (() => {
                return (
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="h-full"
                  >
                    <TabsContent value="details" className="mt-0 h-full">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between pb-4 border-b">
                          <div>
                            <p className="text-3xl font-bold text-gray-900 mb-2">
                              {groupedStocks[selectedStockId as number]?.name}
                            </p>
                            <div className="flex flex-row items-center gap-2 mt-2">
                              <BuyStockDialog
                                stock={stocks.find(
                                  (s) => s.id === selectedStockId
                                )}
                              />
                              <BuyStockOrderDialog
                                stock={stocks.find(
                                  (s) => s.id === selectedStockId
                                )}
                              />
                              {selectedStockId &&
                                enrichedStocks.find(
                                  (s) => s.id === selectedStockId
                                ) && (
                                  <SellStockDialog
                                    stocks={enrichedStocks}
                                    defaultStock={
                                      enrichedStocks.find(
                                        (s) => s.id === selectedStockId
                                      ) || undefined
                                    }
                                    open={openSellDialog}
                                    setOpen={setOpenSellDialog}
                                    onUpdate={() => setOpenSellDialog(false)}
                                    disabled={
                                      groupedStocks[selectedStockId as number]
                                        ?.quantity === 0
                                    }
                                  />
                                )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {t("marketPrice")}
                            </p>
                            <p className="text-2xl font-bold mb-1">
                              €
                              {groupedStocks[
                                selectedStockId as number
                              ]?.marketPrice.toFixed(2)}
                            </p>
                            <p className="text-xs font-medium text-gray-600">
                              {t("basePricePerShare")}
                            </p>
                            <p className="text-lg font-semibold text-gray-700">
                              €
                              {groupedStocks[selectedStockId as number]
                                ?.quantity > 0
                                ? groupedStocks[
                                    selectedStockId as number
                                  ]?.basePrice.toFixed(2)
                                : "0.00"}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              {t("ownedQuantity")}
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                              {
                                groupedStocks[selectedStockId as number]
                                  ?.quantity
                              }
                            </p>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              {t("remainingQuantity")}
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                              {stocks.find((s) => s.id === selectedStockId)
                                ?.remainingQuantity || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="orders" className="mt-0 h-full">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between pb-4 border-b">
                          <div>
                            <p className="text-3xl font-bold text-gray-900 mb-2">
                              {groupedStocks[selectedStockId as number]?.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {t("marketPrice")}
                            </p>
                            <p className="text-2xl font-bold mb-1">
                              €
                              {groupedStocks[
                                selectedStockId as number
                              ]?.marketPrice.toFixed(2)}
                            </p>
                            <p className="text-xs font-medium text-gray-600">
                              {t("basePricePerShare")}
                            </p>
                            <p className="text-lg font-semibold text-gray-700">
                              €
                              {groupedStocks[selectedStockId as number]
                                ?.quantity > 0
                                ? groupedStocks[
                                    selectedStockId as number
                                  ]?.basePrice.toFixed(2)
                                : "0.00"}
                            </p>
                          </div>
                        </div>

                        {stockOrders
                          .filter(
                            (order) => order.stock?.id === selectedStockId
                          )
                          .filter((order) => order.status !== "completed")
                          .filter(
                            (order) =>
                              orderFilter === "all" ||
                              order.type === orderFilter
                          ).length === 0 ? (
                          <p className="text-center text-gray-500 py-8">
                            {orderFilter === "all"
                              ? t("noOrders")
                              : orderFilter === "buy"
                              ? t("noBuyOrders")
                              : t("noSellOrders")}
                          </p>
                        ) : (
                          stockOrders
                            .filter(
                              (order) => order.stock?.id === selectedStockId
                            )
                            .filter((order) => order.status !== "completed")
                            .filter(
                              (order) =>
                                orderFilter === "all" ||
                                order.type === orderFilter
                            )
                            .map((order) => (
                              <StockOrderItem
                                key={order.id}
                                id={order.id!}
                                type={order.type}
                                status={order.status}
                                amount={order.amount}
                                stock={order.stock}
                              />
                            ))
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                );
              })()}
          </div>
        </div>
      </div>
    </div>
  );
}
