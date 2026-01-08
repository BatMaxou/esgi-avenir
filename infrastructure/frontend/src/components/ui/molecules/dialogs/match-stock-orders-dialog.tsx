"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/atoms/dialog";
import { Button } from "@/components/ui/atoms/button";
import { useFinancialSecurities } from "@/contexts/FinancialSecuritiesContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useStockOrders } from "@/contexts/StockOrdersContext";
import { Loader2, ShoppingCart, ArrowLeft } from "lucide-react";
import { StockOrder } from "../../../../../../../domain/entities/StockOrder";
import { FilledButton } from "../buttons/filled-button";

interface MatchStockOrdersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stockName: string;
  stockOrderId: number;
}

export function MatchStockOrdersDialog({
  open,
  onOpenChange,
  stockName,
  stockOrderId,
}: MatchStockOrdersDialogProps) {
  const t = useTranslations("components.dialogs.stockOrder.match");
  const { matchedStockOrders, isMatchedStockOrdersLoading, acceptStockOrder } =
    useStockOrders();
  const { purchaseFee, getPurchaseFee, isSettingsLoading } = useSettings();
  const { getFinancialSecurities } = useFinancialSecurities();
  const [selectedOrder, setSelectedOrder] = useState<StockOrder | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const fee = parseFloat(purchaseFee?.toString() || "0");

  useEffect(() => {
    if (open && !purchaseFee) {
      getPurchaseFee();
    }
  }, [open]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "sell":
        return "bg-red-100 text-red-600";
      case "buy":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  useEffect(() => {
    getPurchaseFee();
  }, [open]);

  const handleSelectOrder = (order: StockOrder) => {
    setSelectedOrder(order);
  };

  const handleBack = () => {
    setSelectedOrder(null);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setSelectedOrder(null);
    }
    onOpenChange(open);
  };

  const handleConfirmTransaction = async () => {
    if (!selectedOrder) return;
    if (!selectedOrder.id) return;

    setIsConfirming(true);
    const success = await acceptStockOrder(selectedOrder.id, stockOrderId);

    if (success) {
      getFinancialSecurities();
      setSelectedOrder(null);
      onOpenChange(false);
    }
    setIsConfirming(false);
  };

  const totalAmount = selectedOrder ? selectedOrder.amount + fee : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className='mb-8 flex h-[calc(50vh-2rem)] min-w-[calc(50vw-2rem)] flex-col justify-start gap-4 p-4'>
        <DialogHeader>
          <DialogTitle>
            {selectedOrder ? t("confirmTitle") : t("title")}
          </DialogTitle>
          <DialogDescription>
            {selectedOrder ? (
              t("confirmDescription")
            ) : (
              <>
                {t("description")} <strong>{stockName}</strong>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className={`mt-4 h-full ${selectedOrder ? "selectedOrder" : ""}`}>
          {selectedOrder ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t("stockName")}:</span>
                  <span className="font-medium">{stockName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t("transactionType")}:</span>
                  <span className="font-medium">
                    {t(`type.${selectedOrder.type}`)}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-sm">
                  <span className="text-gray-600">{t("price")}:</span>
                  <span className="font-medium">
                    {selectedOrder.amount.toFixed(2)} €
                  </span>
                </div>
                {fee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t("purchaseFee")} :</span>
                    <span className="font-medium">{fee.toFixed(2)} €</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-semibold">{t("total")}:</span>
                    <span className="font-bold">
                      {totalAmount.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>

              {fee > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-900">
                    {t("feeNotice", { fee: purchaseFee as number })}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {isMatchedStockOrdersLoading ? (
                <div className="h-full flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-600">{t("loading")}</span>
                </div>
              ) : matchedStockOrders.length === 0 ? (
                <div className=" h-full flex justify-center items-center text-center py-8 text-gray-500">
                  {t("noMatches")}
                </div>
              ) : (
                <div className="space-y-3 max-h-full overflow-y-auto pe-2">
                  {matchedStockOrders.sort((a,b) => a.amount - b.amount ).map((order: StockOrder) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">
                              {stockName}
                            </span>
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeColor(
                                order.type
                              )}`}
                            >
                              {t(`type.${order.type}`)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {t("price")}:{" "}
                            <span className="font-semibold text-gray-900">
                              {order.amount} €
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSelectOrder(order)}
                          className="ml-4 p-2 rounded-full cursor-pointer bg-red-600 hover:bg-red-700 text-white transition-colors"
                          aria-label={t("selectOffer")}
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {selectedOrder && (
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleBack}
              className="cursor-pointer"
              disabled={isConfirming}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("back")}
            </Button>
            <FilledButton
              onClick={handleConfirmTransaction}
              disabled={isConfirming}
              loading={isConfirming}
              label={isConfirming ? t("confirming") : t("confirm")}
            />
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
