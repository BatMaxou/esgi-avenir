"use client";

import { UpdateSettingDialog } from "@/components/ui/molecules/dialogs/update-setting-dialog";
import { useNavigation } from "@/contexts/NavigationContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useEffect } from "react";
import { SettingEnum } from "../../../../../../../../domain/enums/SettingEnum";

export default function DirectorSettingsPage() {
  const { endNavigation } = useNavigation();
  const { savingsRate, purchaseFee, saleFee, getAllSettings } = useSettings();

  useEffect(() => {
    endNavigation();
    getAllSettings();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Taux d'épargne
          </h3>
          <UpdateSettingDialog
            code={SettingEnum.SAVINGS_RATE}
            title="Taux d'épargne"
            currentValue={savingsRate}
          />
        </div>
        <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium w-fit">
          {savingsRate}%
        </div>
        <p className="text-gray-600 text-sm">
          Taux d'intérêt appliqué sur les comptes d'épargne
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Frais d'achat</h3>
          <UpdateSettingDialog
            code={SettingEnum.STOCK_ORDER_PURCHASE_FEE}
            title="Frais d'achat"
            currentValue={purchaseFee}
          />
        </div>
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium w-fit">
          {purchaseFee}%
        </div>
        <p className="text-gray-600 text-sm">
          Frais appliqués lors de l'achat d'actions
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Frais de vente
          </h3>
          <UpdateSettingDialog
            code={SettingEnum.STOCK_ORDER_SALE_FEE}
            title="Frais de vente"
            currentValue={saleFee}
          />
        </div>
        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium  w-fit">
          {saleFee}%
        </div>
        <p className="text-gray-600 text-sm">
          Frais appliqués lors de la vente d'actions
        </p>
      </div>
    </div>
  );
}
