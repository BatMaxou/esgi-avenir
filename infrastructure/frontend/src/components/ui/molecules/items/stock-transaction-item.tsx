"use client";

import { useTranslations } from "next-intl";
import { StockOrder } from "../../../../../../../domain/entities/StockOrder";
import { StockOrderTypeEnum } from "../../../../../../../domain/enums/StockOrderTypeEnum";

interface StockTransactionItemProps {
  index: number;
  stockOrder: StockOrder;
}

export function StockTransactionItem({
  index,
  stockOrder,
}: StockTransactionItemProps) {
  const isBuy = stockOrder?.type === StockOrderTypeEnum.BUY;
  const t = useTranslations("components.items.stockTransactionItem");
  return (
    <div
      key={index}
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
    >
      <div>
        <div className="font-medium text-gray-900">
          {stockOrder?.stock?.name}
        </div>
      </div>
      <div>
        {isBuy ? (
          <div className="text-sm text-green-600">{t("buy")}</div>
        ) : (
          <div className="text-sm text-red-600">{t("sell")}</div>
        )}
      </div>
      <div
        className={`font-medium ${isBuy ? "text-green-600" : "text-red-600"}`}
      >
        {isBuy ? "+" : "-"}
        {stockOrder.purchasePrice?.toFixed(2)} €
      </div>
    </div>
  );
}
