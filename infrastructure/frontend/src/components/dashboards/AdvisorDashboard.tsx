"use client";

import { useEffect } from "react";
import { LoadingLink } from "@/components/ui/molecules/links/loading-link";
import { UsersCard } from "@/components/ui/molecules/cards/users-card";
import { ActionsCard } from "@/components/ui/molecules/cards/actions-card";
import { SavingsCard } from "@/components/ui/molecules/cards/savings-card";
import { BankCreditCard } from "@/components/ui/molecules/cards/bank-credit-card.tsx";
import { useNavigation } from "@/contexts/NavigationContext";

export default function AdvisorDashboard() {
  const { endNavigation } = useNavigation();

  useEffect(() => {
    endNavigation();
  }, []);

  return (
    <div className="flex flex-row justify-betweenw-full h-full">
      <div className="flex-1">
        <LoadingLink href="/credits">
          <BankCreditCard />
        </LoadingLink>
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
