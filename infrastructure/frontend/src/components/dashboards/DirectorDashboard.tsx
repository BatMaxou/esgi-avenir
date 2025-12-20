"use client";

import { useEffect } from "react";
import { LoadingLink } from "@/components/ui/molecules/links/loading-link";
import { UsersCard } from "@/components/ui/molecules/cards/users-card";
import { ActionsCard } from "@/components/ui/molecules/cards/actions-card";
import { SavingsCard } from "@/components/ui/molecules/cards/savings-card";
import { useUsers } from "@/contexts/UsersContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { useStocks } from "@/contexts/StocksContext";

export default function DirectorDashboard() {
  const { users, getUsers } = useUsers();
  const { savingsRate, getSavingsRate } = useSettings();
  const { stocks, getStocks } = useStocks();
  const { endNavigation } = useNavigation();

  useEffect(() => {
    endNavigation();
    getUsers();
    getSavingsRate();
    getStocks();
  }, []);

  return (
    <div className="flex flex-row gap-8 w-full h-full">
      <div className="flex-1 flex flex-col gap-6">
        <LoadingLink href="/users">
          <UsersCard count={users.length} />
        </LoadingLink>
        <LoadingLink href="/actions">
          <ActionsCard count={stocks.length} />
        </LoadingLink>
      </div>

      <div className="flex-1">
        <LoadingLink href="/settings">
          <div className="h-full">
            <SavingsCard
              savingsRate={savingsRate}
              buyingFees={2.5}
              sellingFees={1.5}
            />
          </div>
        </LoadingLink>
      </div>
    </div>
  );
}
