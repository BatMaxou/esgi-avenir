"use client";

import { UserStocksCard } from "@/components/ui/molecules/cards/user-stocks-card";
import { RecentCompaniesCard } from "@/components/ui/molecules/cards/recent-companies-card";
import { UserCompaniesCard } from "@/components/ui/molecules/cards/user-companies-card";
import { useNavigation } from "@/contexts/NavigationContext";
import { useEffect } from "react";

export default function InvestmentsPage() {
  const { endNavigation } = useNavigation();

  useEffect(() => {
    endNavigation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-row gap-8">
      <div className="grid grid-cols-1 gap-6 w-full">
        <UserStocksCard />
        <UserCompaniesCard />
      </div>

      <div className="grid grid-cols-1 gap-6 w-full">
        <RecentCompaniesCard />
      </div>
    </div>
  );
}
