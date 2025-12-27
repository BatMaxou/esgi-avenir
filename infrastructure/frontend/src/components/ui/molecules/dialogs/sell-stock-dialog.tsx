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
import { Tooltip, TooltipTrigger } from "../../atoms/tooltip";
import { Icon } from "@iconify/react";
import { TooltipContent } from "@radix-ui/react-tooltip";

interface SellStockDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  companyName: string;
  purchasePrice: number;
  currentPrice: number;
  quantity?: number;
}

export function SellStockDialog({
  open,
  setOpen,
  companyName,
  purchasePrice,
  currentPrice,
  quantity = 1,
}: SellStockDialogProps) {
  const t = useTranslations("components.dialogs.stock.sell");
  const { saleFee, getSaleFee } = useSettings();
  const { accounts, getAccounts, isAccountsLoading } = useAccounts();
  const [sellQuantity, setSellQuantity] = useState(quantity);
  const [sellPrice, setSellPrice] = useState(currentPrice);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setSellPrice(currentPrice);
  }, [currentPrice]);

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      const firstCurrentAccount = accounts.find((acc) => !acc.isSavings);
      if (firstCurrentAccount && firstCurrentAccount.id) {
        setSelectedAccountId(firstCurrentAccount.id.toString());
      }
    }
  }, [accounts, selectedAccountId]);

  const handleSell = async () => {
    if (!selectedAccountId) {
      return;
    }

    setIsSubmitting(true);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger>
            <div className="hover:text-red-700 hover:bg-gray-200 p-2 rounded-full cursor-pointer transition-all">
              <Icon
                icon="streamline-ultimate:begging-hand-coin-2"
                className="text-red-600"
                width={24}
                height={24}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("sellStock")}</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t("company")}:</span>
              <span className="font-medium">{companyName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                {t("purchasePrice")}:
              </span>
              <span className="font-medium">{purchasePrice.toFixed(2)} €</span>
            </div>
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
            <p className="text-xs text-gray-500">
              {t("currentPriceInfo")}: {currentPrice.toFixed(2)} €
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">{t("quantity")}</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={quantity}
              value={sellQuantity}
              onChange={(e) =>
                setSellQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
            />
            <p className="text-xs text-gray-500">
              {t("maxQuantity")}: {quantity}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account">{t("targetAccount")}</Label>
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

          {saleFee && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <p className="text-sm text-amber-900">
                {t("saleFeeInfo", { fee: saleFee as string })}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSell}
            disabled={
              isSubmitting || !selectedAccountId || accounts.length === 0
            }
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? t("selling") : t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
