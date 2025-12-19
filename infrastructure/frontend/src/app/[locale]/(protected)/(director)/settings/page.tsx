"use client";

import { UpdateSettingDialog } from "@/components/ui/molecules/dialogs/update-setting-dialog";
import { useNavigation } from "@/contexts/NavigationContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useEffect } from "react";
import { SettingEnum } from "../../../../../../../../domain/enums/SettingEnum";
import { useTranslations } from "next-intl";

export default function DirectorSettingsPage() {
  const { endNavigation } = useNavigation();
  const { savingsRate, purchaseFee, saleFee, getAllSettings } = useSettings();
  const t = useTranslations("page.settings");

  useEffect(() => {
    endNavigation();
    getAllSettings();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("savingsRate")}
          </h3>
          <UpdateSettingDialog
            code={SettingEnum.SAVINGS_RATE}
            title={t("savingsRate")}
            currentValue={savingsRate}
          />
        </div>
        <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium w-fit">
          {savingsRate}%
        </div>
        <p className="text-gray-600 text-sm">{t("savingsRateDescription")}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("purchaseFee")}
          </h3>
          <UpdateSettingDialog
            code={SettingEnum.STOCK_ORDER_PURCHASE_FEE}
            title={t("purchaseFee")}
            currentValue={purchaseFee}
          />
        </div>
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium w-fit">
          {purchaseFee}%
        </div>
        <p className="text-gray-600 text-sm">{t("purchaseFeeDescription")}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("saleFee")}
          </h3>
          <UpdateSettingDialog
            code={SettingEnum.STOCK_ORDER_SALE_FEE}
            title={t("saleFee")}
            currentValue={saleFee}
          />
        </div>
        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium  w-fit">
          {saleFee}%
        </div>
        <p className="text-gray-600 text-sm">{t("saleFeeDescription")}</p>
      </div>
    </div>
  );
}
