"use client";

import { useEffect } from "react";
import { useFinancialSecurities } from "@/contexts/FinancialSecuritiesContext";
import { useTranslations } from "next-intl";
import { LoaderCircleIcon, Building2 } from "lucide-react";
import { LoadingLink } from "../links/loading-link";
import { Icon } from "@iconify/react";

export function UserCompaniesCard() {
  const t = useTranslations("components.cards.myCompanies");
  const {
    financialSecurities,
    isFinancialSecuritiesLoading,
    getFinancialSecurities,
  } = useFinancialSecurities();

  useEffect(() => {
    getFinancialSecurities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myCompanies = [
    ...new Set(
      financialSecurities
        .map((security) => security.stock?.name)
        .filter((name): name is string => !!name)
    ),
  ];

  if (isFinancialSecuritiesLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-[400px] flex flex-col">
        <h2 className="text-xl font-semibold mb-4">{t("title")}</h2>
        <div className="flex items-center justify-center flex-1">
          <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
        </div>
      </div>
    );
  }

  if (myCompanies.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-[400px] flex flex-col">
        <h2 className="text-xl font-semibold mb-4">{t("title")}</h2>
        <div className="flex items-center justify-center flex-1">
          <p className="text-gray-500 text-center">{t("noCompanies")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{t("title")}</h2>
        <LoadingLink
          href="/investments/my-companies"
          className="flex items-center"
        >
          <p className="hover:underline inline-block text-end">
            {t("seeAll")}
            <Icon icon="mdi:arrow-right" className="inline-block ml-1" />
          </p>
        </LoadingLink>
      </div>{" "}
      <div className="flex-1 overflow-auto space-y-3">
        {myCompanies.map((company, index) => {
          const count = financialSecurities.filter(
            (security) => security.stock?.name === company
          ).length;

          return (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                <Building2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{company}</p>
                <p className="text-xs text-gray-500">
                  {count} {count > 1 ? t("stocks") : t("stock")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
