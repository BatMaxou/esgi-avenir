"use client";
import { useTranslations } from "next-intl";

interface CompanyStockItemProps {
  name: string;
  quantity?: number;
  isSelected: boolean;
  onClick: () => void;
}

export function CompanyStockItem({
  name,
  quantity,
  isSelected,
  onClick,
}: CompanyStockItemProps) {
  const t = useTranslations("components.items.companyStocks");
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition-colors border ${
        isSelected
          ? "bg-primary/5 border-primary"
          : "bg-white border-gray-100 hover:bg-gray-50"
      }`}
    >
      <div className="flex justify-between items-start">
        <span className="font-medium text-gray-900">{name}</span>
        {typeof quantity === "number" && quantity > 0 && (
          <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full text-gray-600">
            {quantity} {t("stocks")}
          </span>
        )}
      </div>
    </div>
  );
}
