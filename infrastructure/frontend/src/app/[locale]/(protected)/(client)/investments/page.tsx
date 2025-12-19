"use client";

import { useTranslations } from "next-intl";

export default function InvestmentsPage() {
  const t = useTranslations("page.investments");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
        <p className="text-gray-600">{t("comingSoon")}</p>
      </div>
    </div>
  );
}
