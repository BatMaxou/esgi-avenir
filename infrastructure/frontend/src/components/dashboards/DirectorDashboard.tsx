"use client";

import { useEffect } from "react";
import { LoadingLink } from "@/components/ui/molecules/links/loading-link";
import { UsersCard } from "@/components/ui/molecules/cards/users-card";
import { AccountsCard } from "@/components/ui/molecules/cards/accounts-card";
import { ActionsCard } from "@/components/ui/molecules/cards/actions-card";
import { SavingsCard } from "@/components/ui/molecules/cards/savings-card";
import { useUsers } from "@/contexts/UsersContext";
import { useAccounts } from "@/contexts/AccountsContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useNavigation } from "@/contexts/NavigationContext";

export default function DirectorDashboard() {
  const { users, isUsersLoading, getUsers } = useUsers();
  const { accounts, isAccountsLoading, getAccounts } = useAccounts();
  const { savingsRate, getSavingsRate } = useSettings();
  const { endNavigation } = useNavigation();

  useEffect(() => {
    endNavigation();
    getUsers();
    getAccounts();
    getSavingsRate();
  }, []);

  return (
    <div className="flex flex-row gap-8 w-full h-full">
      {/* Left side - Users and Actions */}
      <div className="flex-1 flex flex-col gap-6">
        <LoadingLink href="/users">
          <UsersCard count={users.length} />
        </LoadingLink>
        <LoadingLink href="/actions">
          <ActionsCard count={0} />
        </LoadingLink>
      </div>

      {/* Right side - Configuration */}
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
