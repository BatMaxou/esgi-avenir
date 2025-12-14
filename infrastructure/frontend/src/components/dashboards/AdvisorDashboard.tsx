"use client";

import { useEffect } from "react";
import { LoadingLink } from "@/components/ui/molecules/links/loading-link";
import { UsersCard } from "@/components/ui/molecules/cards/users-card";
import { ActionsCard } from "@/components/ui/molecules/cards/actions-card";
import { SavingsCard } from "@/components/ui/molecules/cards/savings-card";
import { useNavigation } from "@/contexts/NavigationContext";

export default function AdvisorDashboard() {
  const { endNavigation } = useNavigation();

  useEffect(() => {
    endNavigation();
  }, []);

  return (
    <div className="flex flex-row gap-8 w-full h-full">
      {/* <LoadingLink href="/credits">
        <BankCreditCard />
      </LoadingLink> */}
    </div>
  );
}
