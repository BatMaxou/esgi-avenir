"use client";

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
  return (
    <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg shadow-lg">
      <div className="flex flex-col space-y-6">
        <h3 className="text-4xl uppercase font-bold text-white drop-shadow-lg p-6">
          Paramètres
        </h3>
        <div className="space-y-2 text-white text-sm p-6 pt-0">
          <div className="flex items-center justify-between bg-white/10 px-3 py-2 rounded">
            <span>Taux épargne</span>
            <span className="font-semibold">{savingsRate}%</span>
          </div>
          <div className="flex items-center justify-between bg-white/10 px-3 py-2 rounded">
            <span>Achat</span>
            <span className="font-semibold">{buyingFees}%</span>
          </div>
          <div className="flex items-center justify-between bg-white/10 px-3 py-2 rounded">
            <span>Vente</span>
            <span className="font-semibold">{sellingFees}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
