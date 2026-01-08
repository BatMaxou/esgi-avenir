"use client";

import { Skeleton } from "@/components/ui/atoms/skeleton";
import { Account } from "../../../../../../../domain/entities/Account";
import { useTranslations } from "next-intl";

interface AccountInformationsCardProps {
  account: Account;
  savingsRate?: string | number | boolean | undefined;
  isSettingsLoading?: boolean;
}

export function AccountInformationsCard({
  account,
  savingsRate = 0,
  isSettingsLoading = false,
}: AccountInformationsCardProps) {
  const t = useTranslations("components.cards.accountInformations");
  return (
    <div className="bg-white p-6 rounded-lg shadow w-full mb-4">
      <div className="space-y-4">
        <div>
          <p className="text-gray-600">{t("accountName")}</p>
          <p className="font-semibold">{account.name}</p>
        </div>
        <div>
          <p className="text-gray-600">{t("iban")}</p>
          <p className="font-semibold">{account.iban.value}</p>
        </div>
        <div>
          <p className="text-gray-600">{t("owner")}</p>
          <p className="font-semibold">{account?.owner?.firstName}</p>
        </div>
        {account.isSavings && (
          <div>
            <p className="text-gray-600">{t("savingsRate")}</p>
            {isSettingsLoading ? (
              <Skeleton className="h-4 w-12 mb-1" />
            ) : (
              <p className="font-semibold">{savingsRate}%</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
