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
import { useStockOrders } from "@/contexts/StockOrdersContext";
import { Icon } from "@iconify/react";
import { showErrorToast } from "@/lib/toast";
import { FilledButton } from "../buttons/filled-button";
import { HydratedStock } from "../../../../../../../domain/entities/Stock";
import { HydratedAccount } from "../../../../../../../domain/entities/Account";

interface BuyStockOrderDialogProps {
  stock: HydratedStock | undefined;
}

export function BuyStockOrderDialog({ stock }: BuyStockOrderDialogProps) {
  const t = useTranslations("components.dialogs.stock.buyStockOrder");
  const { purchaseFee, getPurchaseFee } = useSettings();
  const { accounts, getAccounts, isAccountsLoading } = useAccounts();
  const { createBuyStockOrder } = useStockOrders();
  const [selectedAccount, setSelectedAccount] =
    useState<HydratedAccount | null>(null);
  const [buyPrice, setBuyPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feeAmount, setFeeAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && !purchaseFee) {
      getPurchaseFee();
    }
  }, [open, purchaseFee, getPurchaseFee]);

  useEffect(() => {
    if (open && accounts.length === 0) {
      getAccounts();
    }
  }, [open, accounts, getAccounts]);

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      const firstCurrentAccount = accounts.find((acc) => !acc.isSavings);
      if (firstCurrentAccount && firstCurrentAccount.id) {
        setSelectedAccount(firstCurrentAccount);
      }
    }
  }, [accounts, selectedAccount]);

  useEffect(() => {
    if (stock && open) {
      setBuyPrice(stock.balance || 0);
    }
  }, [stock, open]);

  const handleCreateBuyOrder = async () => {
    if (
      !stock ||
      !selectedAccount ||
      !selectedAccount.id ||
      !stock.id ||
      !buyPrice
    ) {
      return;
    }

    const totalCost =
      buyPrice + (purchaseFee ? parseFloat(purchaseFee as string) : 0);

    if (selectedAccount.amount < totalCost) {
      showErrorToast(t("insufficientFunds"));
      return;
    }

    setIsSubmitting(true);
    await createBuyStockOrder(stock.id, selectedAccount.id, buyPrice);

    setIsSubmitting(false);
    setOpen(false);
  };

  useEffect(() => {
    setFeeAmount(parseFloat(purchaseFee as string) || 0);
    setTotalAmount(
      purchaseFee ? buyPrice + parseFloat(purchaseFee as string) : buyPrice
    );
  }, [purchaseFee, buyPrice]);

  return (
    <>
      <FilledButton
        icon="hugeicons:shopping-basket-add-01"
        iconPosition="start"
        iconSize={20}
        label={t("createBuyOrder")}
        disabled={!stock}
        onClick={() => setOpen(true)}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>

          {stock === undefined ? (
            <div className="text-md">{t("stockNotAvailable")}</div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="buyPrice">{t("buyPrice")}</Label>
                <Input
                  id="buyPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(parseFloat(e.target.value) || 0)}
                />
                {stock && (
                  <p className="text-xs text-gray-500">
                    {t("currentPriceInfo")}: {stock.balance.toFixed(2)} €
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="account">{t("paymentAccount")}</Label>
                {isAccountsLoading ? (
                  <div className="text-sm text-gray-500">
                    {t("loadingAccounts")}
                  </div>
                ) : (
                  <Select
                    value={selectedAccount?.id?.toString() || ""}
                    onValueChange={(value) => {
                      const account =
                        accounts.find(
                          (account) => account.id?.toString() === value
                        ) || null;
                      setSelectedAccount(account);
                    }}
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
                  <p className="text-xs text-red-500">
                    {t("noAccountAvailable")}
                  </p>
                )}
              </div>

              {buyPrice > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t("company")}:</span>
                    <span className="font-medium">{stock?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t("buyPrice")}:</span>
                    <span className="font-medium">{buyPrice.toFixed(2)} €</span>
                  </div>
                  {purchaseFee && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {t("purchaseFee")} ({purchaseFee} €):
                        </span>
                        <span className="font-medium text-red-600">
                          +{feeAmount.toFixed(2)} €
                        </span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between">
                          <span className="font-semibold">
                            {t("totalAmount")}:
                          </span>
                          <span className="font-bold text-red-600">
                            {totalAmount.toFixed(2)} €
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {purchaseFee && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                  <p className="text-xs text-amber-900">
                    <Icon
                      icon="mdi:information-outline"
                      className="inline-block mr-1"
                      width={16}
                      height={16}
                    />
                    {t("purchaseFeeNotice", { fee: purchaseFee as string })}
                  </p>
                </div>
              )}
            </div>
          )}
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
              onClick={handleCreateBuyOrder}
              disabled={isSubmitting || !buyPrice}
              label={isSubmitting ? t("creating") : t("confirm")}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
