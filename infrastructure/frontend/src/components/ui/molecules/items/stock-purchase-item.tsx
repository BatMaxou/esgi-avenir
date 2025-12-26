"use client";

interface StockPurchaseItemProps {
  index: number;
  companyName: string;
  purchasePrice: number;
  currentPrice: number;
}

export function StockPurchaseItem({
  index,
  companyName,
  purchasePrice,
  currentPrice,
}: StockPurchaseItemProps) {
  const profitLoss = currentPrice - purchasePrice;
  const isPositive = profitLoss >= 0;

  return (
    <div
      key={index}
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
    >
      <div>
        <div className="font-medium text-gray-900">{companyName}</div>
      </div>
      <div
        className={`font-medium ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {isPositive ? "+" : ""}
        {profitLoss.toFixed(2)} €
      </div>
    </div>
  );
}
