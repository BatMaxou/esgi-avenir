"use client";

import { BankCreditDataTable } from "@/components/ui/organisms/BankCreditDataTable/BankCreditDataTable";
import { useBankCredits } from "@/contexts/BankCreditContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { useEffect } from "react";

export default function CreditsPage() {
  const { endNavigation } = useNavigation();
  const { bankCredits, getAllForAdvisor, isBankCreditsLoading } =
    useBankCredits();

  useEffect(() => {
    getAllForAdvisor();
    endNavigation();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <BankCreditDataTable
        data={bankCredits}
        isLoading={isBankCreditsLoading}
      />
    </div>
  );
}
