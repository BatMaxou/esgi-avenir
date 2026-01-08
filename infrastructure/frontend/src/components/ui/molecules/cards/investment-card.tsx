"use client";

import { useTranslations } from "next-intl";

export const InvestmentCard = () => {
  const t = useTranslations("components.cards.investment");

  return (
    <div className="h-48 w-full bg-white border-2 border-red-700 rounded-lg shadow-lg">
      <div className="h-full bg-[url('/assets/images/trading-bars-icon.svg')] bg-no-repeat bg-[95%_100%] bg-[length:150px_150px] flex items-start">
        <h3 className="text-4xl uppercase font-bold text-red-600 drop-shadow-lg p-6">
          {t("title")} <br />
          {t("subtitle")}
        </h3>
      </div>
    </div>
  );
};

export default InvestmentCard;
