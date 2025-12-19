"use client";

import { useTranslations } from "next-intl";

export const BankCreditCard = () => {
  const t = useTranslations("components.cards.bankCredit");

  return (
    <div className="h-48 w-full bg-gradient-to-br from-red-500 to-red-700 rounded-lg shadow-lg">
      <div className="h-full bg-[url('/assets/images/bank-credit-icon.svg')] bg-no-repeat bg-[95%_100%] bg-[length:150px_150px] flex items-start">
        <h3 className="text-4xl uppercase font-bold text-white drop-shadow-lg p-6">
          {t("title")}
          <br />
          {t("subtitle")}
        </h3>
      </div>
    </div>
  );
};
