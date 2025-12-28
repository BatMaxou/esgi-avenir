"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/atoms/dialog";
import { Button } from "@/components/ui/atoms/button";
import { Input } from "@/components/ui/atoms/input";
import { Label } from "@/components/ui/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/atoms/select";
import { useSettings } from "@/contexts/SettingsContext";
import { useAccounts } from "@/contexts/AccountsContext";
import { Icon } from "@iconify/react";
import { FilledButton } from "../buttons/filled-button";
import { useStockOrders } from "@/contexts/StockOrdersContext";
import { HydratedStock } from "../../../../domain/entities/Stock";

interface OwnedStock {
  id: number;
  name: string;
  quantity: number;
  marketPrice: number;
}

interface SellStockDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  stocks: OwnedStock[] | HydratedStock[];
  defaultStock?: HydratedStock;
  disabled: boolean;
  onUpdate: () => void;
}

export function SellStockDialog({
  open,
  setOpen,
  stocks,
  defaultStock,
  disabled,
  onUpdate,
}: SellStockDialogProps) {
  const t = useTranslations("components.dialogs.stock.sell");
  const { saleFee, getSaleFee } = useSettings();
  const { accounts, getAccounts, isAccountsLoading } = useAccounts();
  const { createSellStockOrder } = useStockOrders();
  const [selectedStockId, setSelectedStockId] = useState<string>(defaultStock?.id.toString() || "0");
  const [sellPrice, setSellPrice] = useState(defaultStock?.balance || 0);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feeAmount, setFeeAmount] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    if (open && !saleFee) {
      getSaleFee();
    }
  }, [open, saleFee, getSaleFee]);

  useEffect(() => {
    if (open && accounts.length === 0) {
      getAccounts();
    }
  }, [open, accounts, getAccounts]);

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      const firstCurrentAccount = accounts.find((acc) => !acc.isSavings);
      if (firstCurrentAccount && firstCurrentAccount.id) {
        setSelectedAccountId(firstCurrentAccount.id.toString());
      }
    }
  }, [accounts, selectedAccountId]);

  useEffect(() => {
    if (stocks.length > 0 && !selectedStockId) {

        setSelectedStockId(stocks[selectedStockId].id.toString());
        setSellPrice(stocks[selectedStockId].marketPrice);
    }
  }, [stocks, open, selectedStockId]);

  useEffect(() => {
    if (defaultStock) {
      setSelectedStockId(defaultStock.id.toString());
      setSellPrice((defaultStock as any).marketPrice || defaultStock.balance || 0);
    }
  }, [defaultStock]);
  const selectedStock = stocks.find(
    (stock) => defaultStock ? stock.id.toString() === defaultStock.id : stock.id.toString() === selectedStockId
  );

  const handleStockChange = (value: string) => {
    setSelectedStockId(value);
    const stock = stocks.find((s) => s.id.toString() === value);
    if (stock) {
      setSellPrice(stock?.marketPrice || defaultStock?.balance || 0);
    }
  };

  const handleSell = async () => {
    if (!selectedStockId || !selectedAccountId || !sellPrice) {
      return;
    }

    setIsSubmitting(true);
    await createSellStockOrder(
      parseInt(selectedStockId),
      parseInt(selectedAccountId),
      parseInt(sellPrice.toString(), 10)
    );

    onUpdate?.();
    setIsSubmitting(false);
    setOpen(false);
  };

  useEffect(() => {
    setFeeAmount(parseFloat(saleFee as string) || 0)
    setTotalAmount(saleFee ? sellPrice - parseFloat(saleFee as string) : sellPrice)
  }, [saleFee, sellPrice]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <FilledButton
          icon="hugeicons:shopping-basket-check-in-01"
          iconPosition="start"
          iconSize={20}
          label={t("sellStock")}
          disabled={disabled}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stock">{t("selectStock")}</Label>
            {stocks.length === 0 ? (
              <div className="text-sm text-gray-500">
                {t("noStocksAvailable")}
              </div>
            ) : (
              <Select value={defaultStock ? defaultStock.id.toString() : selectedStockId} onValueChange={handleStockChange} disabled={!!defaultStock}>
                <SelectTrigger id="stock" className="w-full">
                  <SelectValue placeholder={t("selectStockPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {defaultStock ? (
                    <>
                      <SelectItem key={defaultStock.id} value={defaultStock.id.toString()}>
                        <div className="flex items-center justify-between gap-4 w-full">
                          <span>{defaultStock.name}</span>
                          <span className="text-sm text-gray-600">
                            {defaultStock.securities.length} {t("stocks")}
                          </span>
                        </div>
                      </SelectItem>
                    </>
                  ) : (
                    <>
                    {stocks.filter((stock) => stock.securities.length > 0).map((stock) => (
                      <SelectItem key={stock.id} value={stock.id.toString()}>
                        <div className="flex items-center justify-between gap-4 w-full">
                          <span>{stock.name}</span>
                          <span className="text-sm text-gray-600">
                            {stock.quantity} {t("stocks")}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellPrice">{t("sellPrice")}</Label>
            <Input
              id="sellPrice"
              type="number"
              min="0"
              step="0.01"
              value={sellPrice}
              onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
            />
            {(selectedStock || defaultStock) && (
              <p className="text-xs text-gray-500">
                {t("currentPriceInfo")}: {defaultStock ? defaultStock?.balance.toFixed(2) : selectedStock.marketPrice.toFixed(2)}{" "}
                €
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="account">{t("feeAccount")}</Label>
            {isAccountsLoading ? (
              <div className="text-sm text-gray-500">
                {t("loadingAccounts")}
              </div>
            ) : (
              <Select
                value={selectedAccountId}
                onValueChange={setSelectedAccountId}
              >
                <SelectTrigger id="account" className="w-full">
                  <SelectValue placeholder={t("selectAccount")} />
                </SelectTrigger>
                <SelectContent>
                  {accounts
                    .filter((account) => account.id !== undefined)
                    .map((account) => (
                      <SelectItem
                        key={account.id}
                        value={account.id!.toString()}
                      >
                        <div className="flex items-center justify-between gap-2 w-full">
                          <span>{account.name}</span>
                          <span
                            className={`text-sm ${
                              account.amount < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {account.amount.toFixed(2)} €
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
            {!isAccountsLoading && accounts.length === 0 && (
              <p className="text-xs text-red-500">{t("noAccountAvailable")}</p>
            )}
          </div>

          {(selectedStock || defaultStock) && sellPrice > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t("company")}:</span>
                <span className="font-medium">{selectedStock?.name || defaultStock?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t("sellPrice")}:</span>
                <span className="font-medium">{sellPrice.toFixed(2)} €</span>
              </div>
              {saleFee && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {t("saleFee")} ({saleFee} €):
                    </span>
                    <span className="font-medium text-red-600">
                      -{feeAmount.toFixed(2)} €
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-semibold">{t("totalAmount")}:</span>
                      <span className="font-bold text-green-600">
                        {totalAmount.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {saleFee && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
              <p className="text-xs text-amber-900">
                <Icon
                  icon="mdi:information-outline"
                  className="inline-block mr-1"
                  width={16}
                  height={16}
                />
                {t("saleFeeNotice", { fee: saleFee as string })}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            {t("cancel")}
          </Button>
          <FilledButton
            onClick={handleSell}
            disabled={
              isSubmitting ||
              !selectedStockId ||
              !sellPrice ||
              !selectedAccountId ||
              stocks.length === 0 ||
              accounts.length === 0
            }
            label={isSubmitting ? t("selling") : t("confirm")}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
