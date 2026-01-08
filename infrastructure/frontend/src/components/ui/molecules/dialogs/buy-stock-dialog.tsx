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
import { useStocks } from "@/contexts/StocksContext";
import { Icon } from "@iconify/react";
import { showErrorToast } from "@/lib/toast";
import { FilledButton } from "../buttons/filled-button";
import { HydratedStock } from "../../../../../../../domain/entities/Stock";
import { HydratedAccount } from "../../../../../../../domain/entities/Account";

interface BuyStockDialogProps {
  stock: HydratedStock | undefined;
}

export function BuyStockDialog({ stock }: BuyStockDialogProps) {
  const t = useTranslations("components.dialogs.stock.buyBaseStock");
  const { purchaseFee, getPurchaseFee } = useSettings();
  const { accounts, getAccounts, isAccountsLoading } = useAccounts();
  const { purchaseBaseStock } = useStocks();
  const [selectedAccount, setSelectedAccount] =
    useState<HydratedAccount | null>(null);
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

  const handleBuy = async () => {
    if (!stock || !selectedAccount || !selectedAccount.id || !stock.id) {
      return;
    }

    const totalCost =
      stock.basePrice + (purchaseFee ? parseFloat(purchaseFee as string) : 0);

    if (selectedAccount.amount < totalCost) {
      showErrorToast(t("insufficientFunds"));
      return;
    }

    setIsSubmitting(true);
    await purchaseBaseStock(stock.id, selectedAccount.id);

    setIsSubmitting(false);
    setOpen(false);
  };

  useEffect(() => {
    if (!stock) return;
    setFeeAmount(parseFloat(purchaseFee as string) || 0);
    setTotalAmount(
      purchaseFee
        ? stock.basePrice + parseFloat(purchaseFee as string)
        : stock.basePrice
    );
  }, [purchaseFee, stock]);

  return (
    <>
      <FilledButton
        icon="fluent-mdl2:bank"
        iconPosition="start"
        iconSize={20}
        label={t("buyStock")}
        disabled={!stock || stock.remainingQuantity === 0}
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

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t("company")}:</span>
                  <span className="font-medium">{stock?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t("buyPrice")}:</span>
                  <span className="font-medium">
                    {stock.basePrice.toFixed(2)} €
                  </span>
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
              onClick={handleBuy}
              disabled={isSubmitting}
              label={isSubmitting ? t("buying") : t("confirm")}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
