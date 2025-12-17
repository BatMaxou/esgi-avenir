"use client";

import { BankCredit } from "../../../../../../../domain/entities/BankCredit";

interface BankCreditInformationsCardProps {
  bankCredit: BankCredit;
}

export function BankCreditInformationsCard({
  bankCredit,
}: BankCreditInformationsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold mb-6">Détails du crédit</h1>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gradient-to-br from-gray-0 to-gray-200 p-2">
            <p className="text-sm text-gray-600">Montant</p>
            <p className="text-lg font-medium">{bankCredit.amount} €</p>
          </div>
          <div className="bg-gradient-to-br from-gray-0 to-gray-200 p-2">
            <p className="text-sm text-gray-600">Taux d'intérêt</p>
            <p className="text-lg font-medium">
              {bankCredit.interestPercentage}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-0 to-gray-200 p-2">
            <p className="text-sm text-gray-600">Taux d'assurance</p>
            <p className="text-lg font-medium">
              {bankCredit.insurancePercentage}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-0 to-gray-200 p-2">
            <p className="text-sm text-gray-600">Durée</p>
            <p className="text-lg font-medium">
              {bankCredit.durationInMonths} mois
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
