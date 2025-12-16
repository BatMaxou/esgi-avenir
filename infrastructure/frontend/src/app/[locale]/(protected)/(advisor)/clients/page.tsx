"use client";

import { BankCreditDataTable } from "@/components/ui/organisms/BankCreditDataTable/BankCreditDataTable";
import { UsersDataTable } from "@/components/ui/organisms/UsersDataTable";
import { useBankCredits } from "@/contexts/BankCreditContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { useUsers } from "@/contexts/UsersContext";
import { useEffect } from "react";

export default function ClientsPage() {
  const { endNavigation } = useNavigation();
  const { users: clients, getClients, isUsersLoading } = useUsers();

  useEffect(() => {
    getClients();
    endNavigation();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <UsersDataTable data={clients} isLoading={isUsersLoading} />
    </div>
  );
}
