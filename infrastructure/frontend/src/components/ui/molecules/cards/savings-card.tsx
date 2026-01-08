"use client";

import { useTranslations } from "next-intl";

interface SavingsCardProps {
  savingsRate: string | number | boolean | undefined;
  buyingFees: number;
  sellingFees: number;
}

export const SavingsCard = ({
  savingsRate,
  buyingFees,
  sellingFees,
}: SavingsCardProps) => {
  const t = useTranslations("components.cards.savings");

  return (
    <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg shadow-lg">
      <div className="flex flex-col space-y-6">
        <h3 className="text-4xl uppercase font-bold text-white drop-shadow-lg p-6">
          {t("title")}
        </h3>
        <div className="space-y-2 text-white text-sm p-6 pt-0">
          <div className="flex items-center justify-between bg-white/10 px-3 py-2 rounded">
            <span>{t("savingsRate")}</span>
            <span className="font-semibold">{savingsRate}%</span>
          </div>
          <div className="flex items-center justify-between bg-white/10 px-3 py-2 rounded">
            <span>{t("buying")}</span>
            <span className="font-semibold">{buyingFees}%</span>
          </div>
          <div className="flex items-center justify-between bg-white/10 px-3 py-2 rounded">
            <span>{t("selling")}</span>
            <span className="font-semibold">{sellingFees}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
