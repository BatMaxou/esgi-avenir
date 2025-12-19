"use client";

import { BankCredit } from "../../../../../../../domain/entities/BankCredit";
import { useTranslations } from "next-intl";

interface BankCreditInformationsCardProps {
  bankCredit: BankCredit;
}

export function BankCreditInformationsCard({
  bankCredit,
}: BankCreditInformationsCardProps) {
  const t = useTranslations("components.cards.bankCreditInformations");

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold mb-6">{t("title")}</h1>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gradient-to-br from-gray-0 to-gray-200 p-2">
            <p className="text-sm text-gray-600">{t("amount")}</p>
            <p className="text-lg font-medium">{bankCredit.amount} €</p>
          </div>
          <div className="bg-gradient-to-br from-gray-0 to-gray-200 p-2">
            <p className="text-sm text-gray-600">{t("interestRate")}</p>
            <p className="text-lg font-medium">
              {bankCredit.interestPercentage}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-0 to-gray-200 p-2">
            <p className="text-sm text-gray-600">{t("insuranceRate")}</p>
            <p className="text-lg font-medium">
              {bankCredit.insurancePercentage}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-0 to-gray-200 p-2">
            <p className="text-sm text-gray-600">{t("duration")}</p>
            <p className="text-lg font-medium">
              {bankCredit.durationInMonths} {t("months")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
